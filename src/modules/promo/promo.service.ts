import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPromoService } from './interface/IPromoService';
import { CreatePromoDto } from './dto/createPromo.dto';
import { UpdatePromoDto } from './dto/updatePromo.dto';
import { Promo } from './promo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PromoMapper } from './promo.mapper';
import { IStatutPromoServiceToken } from '../statut-promo/statutPromo.constants';
import { IStatutPromoService } from '../statut-promo/interface/IStatutPromoService';

@Injectable()
export class PromoService implements IPromoService {
  constructor(
    @InjectRepository(Promo)
    private readonly promoRepository: Repository<Promo>,

    @Inject(IStatutPromoServiceToken)
    private readonly StatutPromoService: IStatutPromoService,
  ) {}

  findByIds(ids: string[]): Promise<Promo[]> {
    return this.promoRepository.findBy({ id: In(ids) });
  }

  findBySnowflakes(snowflakes: string[]): Promise<Promo[]> {
    return this.promoRepository.find({
      where: { snowflake: In(snowflakes) },
    });
  }

  findAll(): Promise<Promo[]> {
    return this.promoRepository.find();
  }

  async findActif(): Promise<Promo[]> {
    return this.promoRepository.find({
      relations: ['statutPromo'],
      where: {
        statutPromo: {
          libelle: 'actif',
        },
      },
    });
  }

  async findOne(id: string): Promise<Promo> {
    const promo = await this.promoRepository.findOne({ 
      where: { id },
      relations: ['statutPromo', 'formation', 'campus', 'identifications']
    });
    if (!promo) {
      throw new NotFoundException(`Promo with id ${id} not found`);
    }
    return promo;
  }

  async findOneBySnowflake(snowflake: string): Promise<Promo> {
    const promo = await this.promoRepository.findOne({ 
      where: { snowflake },
      relations: ['statutPromo', 'formation', 'campus', 'identifications']
    });
    if (!promo) {
      throw new NotFoundException(`Promo with snowflake ${snowflake} not found`);
    }
    return promo;
  }

  async findPromoToStart(): Promise<Promo[] | null> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const promos = await this.promoRepository
      .createQueryBuilder('promo')
      .innerJoinAndSelect('promo.statutPromo', 'statutPromo')
      .leftJoinAndSelect('promo.identifications', 'identification')
      .leftJoinAndSelect(
        'identification.statutIdentification',
        'statutIdentification',
      )
      .leftJoinAndSelect('identification.utilisateur', 'utilisateur')
      .leftJoinAndSelect('utilisateur.roles', 'role')
      .where('statutPromo.libelle = :promoLibelle', {
        promoLibelle: 'En attente',
      })
      .andWhere('promo.dateDebut <= :today', { today })
      .andWhere('statutIdentification.libelle = :statutLibelle', {
        statutLibelle: 'accepter',
      })
      .orderBy('promo.dateDebut', 'ASC')
      .getMany();

    return promos.length > 0 ? promos : null;
  }

  async findPromoToArchive() {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const promos = await this.promoRepository
      .createQueryBuilder('promo')
      .leftJoinAndSelect('promo.statutPromo', 'statutPromo')
      .leftJoinAndSelect('promo.identifications', 'identification')
      .leftJoinAndSelect('identification.statutIdentification', 'statutIdentification')
      .leftJoinAndSelect('identification.utilisateur', 'utilisateur')
      .leftJoinAndSelect('utilisateur.roles', 'role')
      .where('statutPromo.libelle = :actif', { actif: 'actif' })
      .andWhere('promo.dateFin < :oneMonthAgo', { oneMonthAgo })
      .andWhere('statutIdentification.libelle = :accepted', { accepted: 'accepter' })
      .orderBy('promo.dateFin', 'ASC')
      .getMany();

    return promos.length > 0 ? promos : null;
  }

  async create(dto: CreatePromoDto): Promise<Promo> {
    const statutEnAttente =
      await this.StatutPromoService.findByLibelle('En attente');

    if (!statutEnAttente) {
      throw new Error('Statut "En attente" not found');
    }

    const promo = PromoMapper.fromCreateDto(dto, statutEnAttente);

    return this.promoRepository.save(promo);
  }

  // FIXED: Update by UUID
  async update(id: string, dto: UpdatePromoDto): Promise<Promo> {
    const existing = await this.promoRepository.findOne({ 
      where: { id },
      relations: ['statutPromo', 'formation', 'campus', 'identifications']
    });
    
    if (!existing) {
      throw new NotFoundException(`Promo with id ${id} not found`);
    }

    // Handle statut relation if provided in DTO
    let statutPromoEntity;
    if (dto.statut?.libelle) {
      statutPromoEntity = await this.StatutPromoService.findByLibelle(dto.statut.libelle);
    }

    // Apply updates to existing entity
    if (dto.nom !== undefined) existing.nom = dto.nom;
    if (dto.dateDebut !== undefined) existing.dateDebut = dto.dateDebut;
    if (dto.dateFin !== undefined) existing.dateFin = dto.dateFin;
    if (dto.snowflake !== undefined) existing.snowflake = dto.snowflake;
    
    if (statutPromoEntity) {
      existing.statutPromo = statutPromoEntity;
    } else if (dto.statut) {
      existing.statutPromo = dto.statut;
    }

    if (dto.identification) {
      existing.identifications = [dto.identification];
    }

    // Save the modified entity
    const saved = await this.promoRepository.save(existing);
    
    // Reload to ensure all relations are fresh
    const reloaded = await this.promoRepository.findOne({
      where: { id: saved.id },
      relations: ['statutPromo', 'formation', 'campus', 'identifications']
    });
    
    if (!reloaded) {
      throw new NotFoundException(`Promo with id ${saved.id} not found after update`);
    }
    
    return reloaded;
  }

  // NEW: Update by Snowflake
  async updateBySnowflake(snowflake: string, dto: UpdatePromoDto): Promise<Promo> {
    const existing = await this.promoRepository.findOne({ 
      where: { snowflake },
      relations: ['statutPromo', 'formation', 'campus', 'identifications']
    });
    
    if (!existing) {
      throw new NotFoundException(`Promo with snowflake ${snowflake} not found`);
    }

    // Handle statut relation if provided in DTO
    let statutPromoEntity;
    if (dto.statut?.libelle) {
      statutPromoEntity = await this.StatutPromoService.findByLibelle(dto.statut.libelle);
    }

    // Apply updates to existing entity
    if (dto.nom !== undefined) existing.nom = dto.nom;
    if (dto.dateDebut !== undefined) existing.dateDebut = dto.dateDebut;
    if (dto.dateFin !== undefined) existing.dateFin = dto.dateFin;
    if (dto.snowflake !== undefined) existing.snowflake = dto.snowflake;
    
    if (statutPromoEntity) {
      existing.statutPromo = statutPromoEntity;
    } else if (dto.statut) {
      existing.statutPromo = dto.statut;
    }

    if (dto.identification) {
      existing.identifications = [dto.identification];
    }

    // Save the modified entity
    const saved = await this.promoRepository.save(existing);
    
    // Reload to ensure all relations are fresh
    return this.promoRepository.findOne({
      where: { id: saved.id },
      relations: ['statutPromo', 'formation', 'campus', 'identifications']
    }) as Promise<Promo>;
  }
}
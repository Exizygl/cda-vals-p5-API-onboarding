import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPromoService } from './interface/IPromoService';
import { CreatePromoDto } from './dto/createPromo.dto';
import { UpdatePromoDto } from './dto/updatePromo.dto';
import { Promo } from './promo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PromoMapper } from './promo.mapper';
import { IStatutPromoServiceToken } from '../statut-promo/statutPromo.constants';
import { IStatutPromoService }from '../statut-promo/interface/IStatutPromoService';

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
    const promo = await this.promoRepository.findOne({ where: { id } });
    if (!promo) {
      throw new NotFoundException(`Promo with id ${id} not found`);
    }
    return promo;
  }
  async findOneBySnowflake(snowflake: string): Promise<Promo> {
    const promo = await this.promoRepository.findOne({ where: { snowflake } });
    if (!promo) {
      throw new NotFoundException(`Promo with id ${snowflake} not found`);
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

  async update(id: string, dto: UpdatePromoDto): Promise<Promo> {
    const promo = await this.promoRepository.findOne({
      where: { id },
      relations: ['statutPromo', 'formation', 'campus'], // si ton test les utilise
    });
  
    if (!promo) {
      throw new NotFoundException(`Promo with id ${id} not found`);
    }
  
    Object.assign(promo, dto);
  
    return await this.promoRepository.save(promo);
  }
  
}

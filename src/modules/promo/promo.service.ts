import { Injectable, NotFoundException } from '@nestjs/common';
import { IPromoService } from './interface/IPromoService';
import { CreatePromoDto } from './dto/createPromo.dto';
import { UpdatePromoDto } from './dto/updatePromo.dto';
import { Promo } from './promo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PromoMapper } from './promo.mapper';

@Injectable()
export class PromoService implements IPromoService {
  constructor(
    @InjectRepository(Promo)
    private readonly promoRepository: Repository<Promo>,
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


async findPromoToStart(): Promise<Promo | null> {
  const today = new Date();
  
  today.setHours(0, 0, 0, 0);

  const promo = await this.promoRepository
    .createQueryBuilder('promo')
    .innerJoinAndSelect('promo.statutPromo', 'statutPromo')
    .where('statutPromo.libelle = :libelle', { libelle: 'En attente' })
    .andWhere('promo.dateDebut <= :today', { today })
    .orderBy('promo.dateDebut', 'ASC') 
    .getOne();

  return promo || null;
}

async findPromoToArchive(): Promise<Promo | null> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const promo = await this.promoRepository
    .createQueryBuilder('promo')
    .innerJoinAndSelect('promo.statutPromo', 'statutPromo')
    .where('statutPromo.libelle = :libelle', { libelle: 'Actif' })
    .andWhere('promo.dateFin <= :oneMonthAgo', { oneMonthAgo })
    .orderBy('promo.dateFin', 'ASC')
    .getOne();

  return promo || null;
}

async create(dto: CreatePromoDto): Promise<Promo> {

  const statutEnAttente = await this.statutPromoRepository.findOne({
    where: { libelle: 'En attente' },
  });

  if (!statutEnAttente) {
    throw new Error('Statut "En attente" not found');
  }


  const promo = PromoMapper.fromCreateDto(dto, statutEnAttente);

 
  return this.promoRepository.save(promo);
}

  update(id: string, dto: UpdatePromoDto): Promise<Promo> {
    return this.promoRepository.save({ ...dto, id });
  }
}

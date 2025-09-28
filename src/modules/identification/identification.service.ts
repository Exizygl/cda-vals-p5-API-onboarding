import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Identification } from './identification.entity';
import { CreateIdentificationDto } from './dto/createIdentification.dto';
import { UpdateIdentificationDto } from './dto/updateIdentification.dto';
import { IIdentificationService } from './interface/IIdentificationService';
import { StatutIdentification } from '../statut-identification/statutIdentification.entity';
import { Promo } from '../promo/promo.entity';
import { Utilisateur } from '../utilisateur/utilisateur.entity';

@Injectable()
export class IdentificationService implements IIdentificationService {
  constructor(
    @InjectRepository(Identification)
    private readonly identificationRepository: Repository<Identification>,

    @InjectRepository(StatutIdentification)
    private readonly statutIdentificationRepository: Repository<StatutIdentification>,

    @InjectRepository(Promo)
    private readonly promoRepository: Repository<Promo>,

    @InjectRepository(Utilisateur)
    private readonly utilisateurRepository: Repository<Utilisateur>,
  ) {}

  async create(dto: CreateIdentificationDto): Promise<Identification> {
    const statut = await this.statutIdentificationRepository.findOneBy({ libelle: 'En attente' });
  if (!statut) {
    throw new NotFoundException(`StatutIdentification with libelle 'En attente' not found`);
  }

    const promo = await this.promoRepository.findOneBy({ id: dto.promoId });
    if (!promo) {
      throw new NotFoundException(`Promo with id ${dto.promoId} not found`);
    }

    const utilisateur = await this.utilisateurRepository.findOneBy({ id: dto.utilisateurId });
    if (!utilisateur) {
      throw new NotFoundException(`Utilisateur with id ${dto.utilisateurId} not found`);
    }

    const identification = this.identificationRepository.create({
      dateCreation: new Date(),
      statutIdentification: statut,
      promo,
      utilisateur,
    });

    return this.identificationRepository.save(identification);
  }

  async findById(id: string): Promise<Identification> {
    const identification = await this.identificationRepository.findOne({
      where: { id },
      relations: ['statutidentification', 'promo', 'utilisateur'],
    });

    if (!identification) {
      throw new NotFoundException(`Identification with id ${id} not found`);
    }

    return identification;
  }

  async update(id: string, dto: UpdateIdentificationDto): Promise<Identification> {
    const identification = await this.findById(id);

    if (dto.statutIdentificationId !== undefined) {
      const statut = await this.statutIdentificationRepository.findOneBy({ id: dto.statutIdentificationId });
      if (!statut) {
        throw new NotFoundException(`StatutIdentification with id ${dto.statutIdentificationId} not found`);
      }
      identification.statutIdentification = statut;
    }

    return this.identificationRepository.save(identification);
  }
}

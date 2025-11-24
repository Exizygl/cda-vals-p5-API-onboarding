import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatutPromo } from '../../modules/statut-promo/statutPromo.entity';
import { StatutIdentification } from '../../modules/statut-identification/statutIdentification.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(StatutPromo)
    private statutPromoRepo: Repository<StatutPromo>,
    
    @InjectRepository(StatutIdentification)
    private statutIdentRepo: Repository<StatutIdentification>,
  ) {}

  /**
   * Lance les seeds de manière idempotente
   * Vérifie si les données existent déjà avant de les créer
   */
  async seed() {
    this.logger.log('🌱 Checking for new seed data...');

    await this.seedStatutsPromo();
    await this.seedStatutsIdentification();

    this.logger.log('✅ Seed check completed!');
  }


  private async seedStatutsPromo() {
    const statuts = [
      { libelle: 'en attente' },
      { libelle: 'actif' },
      { libelle: 'archivée' },
 
    ];

    for (const statut of statuts) {
      const exists = await this.statutPromoRepo.findOne({
        where: { libelle: statut.libelle },
      });
      
      if (!exists) {
        await this.statutPromoRepo.save(statut);
        this.logger.log(`✅ Nouveau statut promo créé: ${statut.libelle}`);
      }
    }
  }


  private async seedStatutsIdentification() {
    const statuts = [
      { libelle: 'en attente' },
      { libelle: 'accepté' },
      { libelle: 'refusée' },
    ];

    for (const statut of statuts) {
      const exists = await this.statutIdentRepo.findOne({
        where: { libelle: statut.libelle },
      });
      
      if (!exists) {
        await this.statutIdentRepo.save(statut);
        this.logger.log(`✅ Nouveau statut identification créé: ${statut.libelle}`);
      }
    }
  }
}
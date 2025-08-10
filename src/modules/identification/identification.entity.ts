import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StatutIdentification } from '../statut-identification/statutIdentification.entity';
import { Promo } from '../promo/promo.entity';
import { Utilisateur } from '../utilisateur/utilisateur.entity';
import { Exclude } from 'class-transformer';

@Entity('identification')
export class Identification {
  @PrimaryGeneratedColumn('uuid', { name: 'id_identification' })
  id: string;

  @Column({ name: 'date_creation_identification', type: 'timestamptz' })
  dateCreation: Date;

  @Column({ name: 'date_modification_identification', type: 'timestamptz', nullable: true })
  dateModification: Date;

  @ManyToOne(() => StatutIdentification)
  @JoinColumn({ name: 'id_statut_identification' })
  statutidentification: StatutIdentification;

  @ManyToOne(() => Promo)
  @JoinColumn({ name: 'id_promo' })
  @Exclude()
  promo: Promo;

  @ManyToOne(() => Utilisateur)
  @JoinColumn({ name: 'id_utilisateur' })
  @Exclude()
  utilisateur: Utilisateur;
}

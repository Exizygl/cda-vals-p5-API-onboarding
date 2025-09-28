import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatutIdentification } from '../statut-identification/statutIdentification.entity';
import { Promo } from '../promo/promo.entity';
import { Utilisateur } from '../utilisateur/utilisateur.entity';
import { Exclude } from 'class-transformer';

@Entity('identification')
export class Identification {
  @PrimaryGeneratedColumn('uuid', { name: 'id_identification' })
  id: string;

  @CreateDateColumn({
    name: 'date_creation_identification',
    type: 'timestamptz',
  })
  dateCreation: Date;

  @UpdateDateColumn({
    name: 'date_modification_identification',
    type: 'timestamptz',
    nullable: true,
  })
  dateModification: Date;

  @ManyToOne(() => StatutIdentification, (statut) => statut.id)
  @JoinColumn({ name: 'id_statut_identification' })
  statutIdentification: StatutIdentification;

  @ManyToOne(() => Promo, (promo) => promo.identifications)
  @JoinColumn({ name: 'id_promo' })
  @Exclude()
  promo: Promo;

 @ManyToOne(() => Utilisateur, (utilisateur) => utilisateur.identifications)
  @JoinColumn({ name: 'id_utilisateur' })
  @Exclude()
  utilisateur: Utilisateur;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { StatutPromo } from '../statut-promo/statutPromo.entity';
import { Formation } from '../formation/formation.entity';
import { Campus } from '../campus/campus.entity';
import { Identification } from '../identification/identification.entity';

@Entity('promo')
export class Promo {
  @PrimaryGeneratedColumn('uuid', { name: 'id_promo' })
  id: string;

  @Column({ name: 'nom_promo', type: 'varchar', length: 100 })
  nom: string;

  @Column({ name: 'date_debut_promo', type: 'date' })
  dateDebut: Date;

  @Column({ name: 'date_fin_promo', type: 'date' })
  dateFin: Date;

  @Column({ name: 'snowflake_promo', type: 'bigint', nullable: true,  unique: true})
  snowflake: string;

  @CreateDateColumn({ name: 'date_creation_promo', type: 'timestamptz' })
  dateCreation: Date;

  @UpdateDateColumn({ name: 'date_modification_promo', type: 'timestamptz', nullable: true })
  dateModification: Date;

  @ManyToOne(() => StatutPromo)
  @JoinColumn({ name: 'id_statut_promo' })
  statutPromo: StatutPromo;

  @ManyToOne(() => Formation)
  @JoinColumn({ name: 'id_formation' })
  formation: Formation;

  @ManyToOne(() => Campus)
  @JoinColumn({ name: 'id_campus' })
  campus: Campus;

  @OneToMany(() => Identification, (identification) => identification['promo'])
  identifications: Identification[];
}

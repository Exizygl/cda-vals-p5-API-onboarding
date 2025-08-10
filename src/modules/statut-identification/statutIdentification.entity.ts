import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';


@Entity('statut_identification')
export class StatutIdentification {
  @PrimaryGeneratedColumn({ name: 'id_statut_identification', type: 'smallint' })
  id: string;

  @Column({ name: 'libelle_statut_identification', type: 'varchar', length: 50 })
  libelle: string;

  @CreateDateColumn({ name: 'date_creation_statut_identification', type: 'timestamptz' })
  dateCreation: Date;

  @UpdateDateColumn({ name: 'date_modification_statut_identification', type: 'timestamptz' })
  dateModification: Date;

}

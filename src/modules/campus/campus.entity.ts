import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';


@Entity('campus')
export class Campus {
  @PrimaryColumn({ name: 'id_campus', type: 'bigint' })
  id: string;

  @Column({ name: 'nom_campus', type: 'varchar', length: 100 })
  nom: string;

  @Column({ name: 'actif_campus', type: 'boolean' })
  actif: boolean;

  @CreateDateColumn({ name: 'date_creation_campus', type: 'timestamptz' })
  dateCreation: Date;

  @UpdateDateColumn({ name: 'date_modification_campus', type: 'timestamptz' })
  dateModification: Date;

}

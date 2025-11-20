import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';


@Entity('formation')
export class Formation {
  @PrimaryColumn({ name: 'id_formation', type: 'bigint' })
  id: string;

  @Column({ name: 'nom_formation', type: 'varchar', length: 100 })
  nom: string;

  @Column({ name: 'actif_formation', type: 'boolean' })
  actif: boolean;

  @CreateDateColumn({ name: 'date_creation_formation', type: 'timestamptz' })
  dateCreation: Date;

  @UpdateDateColumn({ name: 'date_modification_formation', type: 'timestamptz' })
  dateModification: Date;

}

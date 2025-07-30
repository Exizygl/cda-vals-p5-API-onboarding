import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn} from 'typeorm';


@Entity('statut_promo')
export class Role {
  @PrimaryGeneratedColumn({ name: 'id_statut_promo', type: 'smallint' })
  id: number;

  @Column({ name: 'libelle_statut_promo', type: 'varchar', length: 50 })
  libelle: string;

  @CreateDateColumn({ name: 'date_creation_statut_promo', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'date_modification_statut_promo', type: 'timestamptz' })
  updatedAt: Date;

}

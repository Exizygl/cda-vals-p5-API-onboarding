import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';


@Entity('campus')
export class Role {
  @PrimaryGeneratedColumn({ name: 'id_campus', type: 'bigint' })
  id: number;

  @Column({ name: 'nom_campus', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'actif_campus', type: 'boolean' })
  selectionnable: boolean;

  @CreateDateColumn({ name: 'date_creation_campus', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'date_modification_campus', type: 'timestamptz' })
  updatedAt: Date;

}

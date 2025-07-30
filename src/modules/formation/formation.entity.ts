import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';


@Entity('formation')
export class Role {
  @PrimaryGeneratedColumn({ name: 'id_formation', type: 'bigint' })
  id: number;

  @Column({ name: 'nom_formation', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'actif_formation', type: 'boolean' })
  selectionnable: boolean;

  @CreateDateColumn({ name: 'date_creation_formation', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'date_modification_formation', type: 'timestamptz' })
  updatedAt: Date;

}

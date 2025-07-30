import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Utilisateur } from '../utilisateur.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn({ name: 'id_role', type: 'bigint' })
  id: number;

  @Column({ name: 'nom_role', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'selectionnable_role', type: 'boolean' })
  selectionnable: boolean;

  @CreateDateColumn({ name: 'date_creation_role', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'date_modification_role', type: 'timestamptz' })
  updatedAt: Date;

  @ManyToMany(() => Utilisateur, utilisateur => utilisateur.roles)
  utilisateurs: Utilisateur[];
}

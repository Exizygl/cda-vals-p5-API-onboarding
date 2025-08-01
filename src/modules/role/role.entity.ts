import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { Utilisateur } from '../utilisateur/utilisateur.entity';

@Entity('role')
export class Role {
  @PrimaryColumn({ name: 'id_role', type: 'bigint' })
  id: string;

  @Column({ name: 'nom_role', type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'selectionnable_role', type: 'boolean' })
  selectionnable: boolean;

  @CreateDateColumn({ name: 'date_creation_role', type: 'timestamptz' })
  dateCreation: Date;

  @UpdateDateColumn({ name: 'date_modification_role', type: 'timestamptz' })
  dateModification: Date;

  @ManyToMany(() => Utilisateur, utilisateur => utilisateur.roles)
  utilisateurs: Utilisateur[];
}

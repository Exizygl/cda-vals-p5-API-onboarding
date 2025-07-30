// src/modules/user/user.entity.ts
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { Role } from '../role/role.entity';

@Entity({ name: 'utilisateur' }) 
export class Utilisateur {
  @PrimaryColumn({ name: 'id_utilisateur', type: 'bigint' })
  id: string; 

  @Column({ name: 'nom_utilisateur', type: 'varchar', length: 100 })
  nom: string;

  @Column({ name: 'prenom_utilisateur', type: 'varchar', length: 100 })
  prenom: string;

  @CreateDateColumn({ name: 'date_creation_utilisateur', type: 'timestamptz' })
  dateCreation: Date;

  @UpdateDateColumn({ name: 'date_modification_utilisateur', type: 'timestamptz', nullable: true })
  dateModification: Date;

  @ManyToMany(() => Role, (role) => role.utilisateurs)
  @JoinTable({
    name: 'utilisateur_role', 
    joinColumn: {
      name: 'id_utilisateur',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'id_role',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];
}



import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class ConfigBot {
    @PrimaryGeneratedColumn()
    configId: number;

    // Channel where newcomers can input their name
    @Column({ name: "salon_arrivee_id", type: 'bigint', nullable: true })
    salonArriveeId: string;

    // Role granted once newcomers have input their name
    @Column({ name: "nouvel_arrivant_role_id", type: 'bigint', nullable: true })
    nouvelArrivantRoleId: string;

    // Channel where users can request to join a promotion
    @Column({ name: "salon_identification_id", type: 'bigint', nullable: true })
    salonIdentificationId: string;

    // Channel where staff can manage identifications
    @Column({ name: "salon_identification_staff_id", type: 'bigint', nullable: true })
    salonIdentificationStaffId: string;

    // Role for users who are currently in a promotion
    @Column({ name: "apprenant_role_id", type: 'bigint', nullable: true })
    apprenantRoleId: string;

    // Role for users who have been in a promotion
    @Column({ name: "alumni_role_id", type: 'bigint', nullable: true })
    alumniRoleId: string;

    // Role for coaches
    @Column({ name: "formateur_role_id", type: 'bigint', nullable: true })
    formateurRoleId: string;

    // Role for staff members
    @Column({ name: "staff_role_id", type: 'bigint', nullable: true })
    staffRoleId: string;

    // Category used as a template for new promotions
    @Column({ name: "template_categorie_id", type: 'bigint',nullable: true })
    templateCategorieId: string;

    // Placeholder role for trainees
    @Column({ name: "template_apprenant_role_id", type: 'bigint', nullable: true })
    templateApprenantRoleId: string;

    // Placeholder role for alumni
    @Column({ name: "template_alumni_role_id", type: 'bigint', nullable: true })
    templateAlumniRoleId: string;

    // Placeholder role for coaches
    @Column({ name: "template_formateur_role_id", type: 'bigint', nullable: true })
    templateFormateurRoleId: string;

    
    // Date logging
    @CreateDateColumn({ name: 'date_creation_config ', type: 'timestamptz' })
    dateCreation: Date;

    @UpdateDateColumn({ name: 'date_modification_config ', type: 'timestamptz' })
    dateModification: Date;
}

import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

/**
 * Entidad que representa a un usuario dentro del sistema.
 */
@Entity('users')
export class User {

    /**
     * Identificador único generado automáticamente como UUID.
     */
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    /**
     * Correo electrónico del usuario. Debe ser único.
     */
    @Column({ type: 'varchar', length: 255, unique: true })
    email!: string

    /**
     * Nombre del usuario.
     */
    @Column({ type: 'varchar', length: 255 })
    nombre!: string;

    /**
     * Apellido del usuario. Este campo es opcional.
     */
    @Column({ type: 'varchar', length: 255, nullable: true })
    apellido?: string;

}
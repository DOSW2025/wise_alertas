import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email!: string

    @Column({ type: 'varchar', length: 255 })
    nombre!: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    apellido?: string;


}
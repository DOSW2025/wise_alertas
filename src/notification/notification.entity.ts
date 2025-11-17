import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('notifications')
export class Notification {

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'varchar' })//, length: 255
  userId!: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion!: Date;

  @Column({ type: 'varchar', length: 255,})
  asunto!: string;

  @Column({ type: 'text' })
  resumen!: string;

  @Column({ type: 'boolean', default: false })
  visto!: boolean;


}
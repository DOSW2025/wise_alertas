import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

/**
 * Entidad que representa una notificación almacenada en la base de datos.
 */
@Entity('notifications')
export class Notification {

  /**
   * Identificador único de la notificación (UUID generado automáticamente).
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del usuario al que pertenece esta notificación.
   */
  @Index()
  @Column({ type: 'varchar' })//, length: 255
  userId!: string;

  /**
   * Fecha en que la notificación fue creada.
   */
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion!: Date;

  /**
   * Asunto o título principal de la notificación.
   */
  @Column({ type: 'varchar', length: 255,})
  asunto!: string;

  /**
   * Contenido o resumen de la notificación.
   */
  @Column({ type: 'text' })
  resumen!: string;

  /**
   * Indica si la notificación ya fue vista por el usuario.
   */
  @Column({ type: 'boolean', default: false })
  visto!: boolean;

}
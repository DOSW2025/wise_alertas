import { IsNumber, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


/**
 * DTO que representa una notificación enviada al usuario.
 */
export class NotificacionDto {

    /**
     * Identificador numérico de la notificación.
     */
    @IsNumber()
    @ApiProperty({
        example: 1,
        description: 'Identificador numérico único de la notificación.'
    })
    id: number;
    
    /**
     * Título o asunto principal de la notificación.
     */
    @IsString()
    @ApiProperty({
        example: 'Nuevo material subido',
        description: 'Título o asunto visible para el usuario.'
    })
    asunto: string;

    /**
     * Descripción corta o resumen del contenido de la notificación.
     */
    @IsString()
    @ApiProperty({
        example: 'Se ha subido un nuevo material al curso de Matemáticas.',
        description: 'Descripción breve o resumen del contenido de la notificación.'
    })
    resumen: string;

    /**
     * Indica si la notificación ya fue vista por el usuario.
     */
    @IsString()
    @ApiProperty({
        example: false,
        description: 'Estado de visualización de la notificación.'
    })
    visto: Boolean;

    /**
     * Fecha de creación de la notificación.
     */
    @ApiProperty({
        example: '2024-06-15T12:34:56Z',
        description: 'Fecha de creación de la notificación en formato ISO-8601.'
    })
    fechaCreacion: Date;

    /**
     * Tipo de notificación (e.g., 'info', 'alerta', 'recordatorio').
     */    @IsString()
    @ApiProperty({
        example: 'info',
        description: 'Tipo de notificación.'
    })
    type: string;
}
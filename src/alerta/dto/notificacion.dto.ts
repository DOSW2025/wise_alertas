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
    @ApiProperty({ example: 1 })
    id: number;
    
    /**
     * Título o asunto principal de la notificación.
     */
    @IsString()
    @ApiProperty({ example: 'Nuevo material subido' })
    asunto: string;

    /**
     * Descripción corta o resumen del contenido de la notificación.
     */
    @IsString()
    @ApiProperty({ example: 'Se ha subido un nuevo material al curso de Matemáticas.' })
    resumen: string;

    /**
     * Indica si la notificación ya fue vista por el usuario.
     */
    @IsString()
    @ApiProperty({ example: false })
    visto: Boolean;

    /**
     * Fecha de creación de la notificación.
     */
    @ApiProperty({ example: '2024-06-15T12:34:56Z' })
    fechaCreacion: Date;
}
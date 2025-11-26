import { IsString, IsArray, ValidateNested,IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ReceptorDto } from './receptor.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO que representa el objeto que recibes en el body del controlador
 * Ejemplo aceptado:
 * {
 *   "recipients": [{ "email": "a@b.com", "name": "A" }],
 *   "template": "nuevoMaterialSubido",
 *   "titulo": "SOLID",
 *   "description": "Definicion...",
 *   "materia": "POO"
 * }
 */
export class MasivoMailDto {

    /** Lista de receptores del correo */
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReceptorDto)
    @ApiProperty({
        type: ReceptorDto,
        isArray: true,
        description: 'Lista de destinatarios del correo masivo.',
        example: [
        { email: 'usuario1@example.com', name: 'Usuario Uno' },
        { email: 'usuario2@example.com', name: 'Usuario Dos' }
        ]
    })
    receptores!: ReceptorDto[];

    
    /** Nombre de la plantilla a usar */
    @IsString()
    @ApiProperty({
        example: 'nuevoMaterialSubido',
        description: 'Nombre de la plantilla de correo a utilizar.'
    })
    template!: string;

    
    /** Texto corto que se guarda como resumen en BD */
    @IsString()
    @ApiProperty({
        required: false,
        example: 'Resumen del correo',
        description: 'Descripción breve que acompañará la notificación.'
    })
    resumen!: string;

    
    /** Indica si debe guardarse una notificación en la BD */
    @IsBoolean()
    @ApiProperty({
        required: false,
        example: true,
        description: 'Define si se debe guardar una notificación para cada usuario.'
    })
    guardar!: boolean;
    
    /** Flag opcional para decidir si se envía o no el correo */
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    @ApiProperty({
        required: false,
        example: true,
        description: 'Determina si se enviará el correo. Por defecto true.'
    })
        mandarCorreo?: boolean = true;
  
}
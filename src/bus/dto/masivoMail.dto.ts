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
    @ApiProperty({ type: () => ReceptorDto, isArray: true })
    receptores!: ReceptorDto[];

    
    /** Nombre de la plantilla a usar */
    @IsString()
    @ApiProperty({ example: 'nuevoMaterialSubido' })
    template!: string;

    
    /** Texto corto que se guarda como resumen en BD */
    @IsString()
    @ApiProperty({ required: false, example: 'Resumen del correo' })
    resumen!: string;

    
    /** Indica si debe guardarse una notificación en la BD */
    @IsBoolean()
    @ApiProperty({ required: false, example: true })
    guardar!: boolean;
    
    /** Flag opcional para decidir si se envía o no el correo */
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    @ApiProperty({ required: false, example: true })
    mandarCorreo?: boolean = true;
  
}
import { IsString, IsArray, ValidateNested,IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ReceptorDto } from '../../alerta/dto/receptor.dto';
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
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReceptorDto)
    @ApiProperty({ type: () => ReceptorDto, isArray: true })
    receptores!: ReceptorDto[];

    @IsString()
    @ApiProperty({ example: 'nuevoMaterialSubido' })
    template!: string;

    @IsString()
    @ApiProperty({ required: false, example: 'Resumen del correo' })
    resumen!: string;

    @IsBoolean()
    @ApiProperty({ required: false, example: true })
    guardar!: boolean;
    
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    @ApiProperty({ required: false, example: true })
    mandarCorreo?: boolean = true;
  
}
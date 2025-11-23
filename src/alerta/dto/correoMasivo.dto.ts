import { IsString, IsArray, ValidateNested} from 'class-validator';
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
export class CorreoMasivoDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReceptorDto)
  @ApiProperty({ type: () => ReceptorDto, isArray: true })
  receptores!: ReceptorDto[];

  @IsString()
  @ApiProperty({ example: 'nuevoMaterialSubido' })
  template!: string;

  
}
import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
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
export class EventoDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReceptorDto)
  @ApiProperty({ type: () => ReceptorDto, isArray: true })
  receptores!: ReceptorDto[];

  @IsString()
  @ApiProperty({ example: 'nuevoMaterialSubido' })
  template!: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: 'SOLID' })
  titulo?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: 'Carlos Gómez' })
  tutor?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: '2025-11-10T10:00:00Z' })
  date?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    example: 'Definicion de los principios SOLID',
  })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, example: 'Programación Orientada a Objetos' })
  materia?: string;

  // Permite campos adicionales en el payload que puedan usarse como contexto
  @IsOptional()
  @ApiProperty({ required: false, type: Object })
  context?: Record<string, any>;
}

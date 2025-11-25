import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para cada destinatario
 */
export class ReceptorDto {
  
  /** Correo electrónico del receptor */
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@example.com' })
  email!: string;

  /** Nombre del receptor */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Jared' })
  name!: string;
}
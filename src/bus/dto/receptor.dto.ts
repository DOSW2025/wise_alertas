import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para cada destinatario
 */
export class ReceptorDto {
  
  /** Correo electrónico del receptor */
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Correo electrónico válido del destinatario.'
  })
  email!: string;

  /** Nombre del receptor */
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre del destinatario que aparecerá en el correo.'
  })
  name!: string;
}
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/** 
 * Datos para enviar un correo dirigido a un único usuario 
*/
export class UnicoMailDto {

    /** Correo del destinatario */
    @IsString()
    @ApiProperty({ example: 'user@example.com', required: true })
    email!: string;

    /** Nombre del destinatario */
    @IsString()
    @ApiProperty({ example: 'Carlos Gómez', required: true })
    name!: string;

    /** Nombre interno de la plantilla */
    @IsString()
    @ApiProperty({ example: 'nuevoMaterialSubido', required: true })
    template!: string;

    /** Breve resumen del contenido del correo */
    @IsString()
    @ApiProperty({ required: true, example: 'Resumen del correo' })
    resumen!: string;

    /** Define si la notificación debe guardarse en BD */
    @IsBoolean()
    @ApiProperty({ required: true, example: true })
    guardar!: boolean;
    
    /** Indica si realmente debe enviarse el correo */
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    @ApiProperty({ required: false, example: true })
    mandarCorreo?: boolean = true;

    /** Año referencial usado en algunas plantillas */
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({ required: false, example: 2025 })
    year?: number = new Date().getFullYear();

    /** Rol anterior del usuario (si aplica) */
    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, example: 'apellido' })
    oldRole?: string;

    /** Nuevo rol del usuario (si aplica) */
    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, example: 'nuevoRol' })
    newRole?: string;

    /** Materia relacionada (cuando la plantilla lo requiere) */
    @IsString()
    @IsOptional()
    materia?: string;

    /** Fecha asociada al evento */
    @IsString()
    @IsOptional()
    fecha?: string;
    
    /** Nombre del tutor */
    @IsString()
    @IsOptional()
    tutor?: string;

    /** Nombre del estudiante */
    @IsString()
    @IsOptional()
    estudiante?: string;

    /** Mensaje libre para personalizar el correo */
    @IsString()
    @IsOptional()
    mensaje?: string;

    /** Modalidad (virtual/presencial) según plantilla */
    @IsString()
    @IsOptional()
    modalidad?: string;

    /** Hora del evento */
    @IsString()
    @IsOptional()
    hora?: string;

}
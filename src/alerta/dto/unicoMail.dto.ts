import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/** 
 * Datos para enviar un correo dirigido a un único usuario 
*/
export class UnicoMailDto {

    /** Correo del destinatario */
    @IsString()
    @ApiProperty({
        example: 'user@example.com',
        required: true,
        description: 'Correo electrónico del usuario que recibirá el mensaje.'
    })
    email!: string;

    /** Nombre del destinatario */
    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'Carlos Gómez',
        required: false,
        description: 'Nombre del usuario que recibirá el mensaje.'
    })
    name?: string;

    /** Nombre interno de la plantilla */
    @IsString()
    @ApiProperty({
        example: 'nuevoMaterialSubido',
        required: true,
        description: 'Plantilla utilizada para generar el correo.'
    })
    template!: string;

    /** Breve resumen del contenido del correo */
    @IsString()
    @ApiProperty({
        required: true,
        example: 'Resumen del correo',
        description: 'Texto corto que resume el contenido del correo.'
    })
    resumen!: string;

    /** Define si la notificación debe guardarse en BD */
    @IsBoolean()
    @ApiProperty({
        required: true,
        example: true,
        description: 'Indica si debe registrarse una notificación en la Base de Datos.'
    })
    guardar!: boolean;

    /** Tipo de notificación */
    @IsString()
    @ApiProperty({
        required: false,
        example: 'info',
        description: 'Tipo de notificación, como info, success, warning, error, achievement.'
    })
    type!: string;
    
    /** Indica si realmente debe enviarse el correo */
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    @ApiProperty({
        required: false,
        example: true,
        description: 'Si es true, se envía el correo. Si es false, solo se guarda la notificación.'
    })
    mandarCorreo?: boolean = true;

    /** Año referencial usado en algunas plantillas */
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({
        required: false,
        example: 2025,
        description: 'Año utilizado por ciertas plantillas como dato adicional.'
    })
    year?: number = new Date().getFullYear();

    //opcionales

    /** Tema del material */
    @IsString()
    @ApiProperty({
        required: false,
        example: 'Programación Básica',
        description: 'Tema del material relacionado con el correo.'
    })
    tema?: string;

    /** Autor del material */
    @IsString()
    @ApiProperty({
        required: false,
        example: 'Juan Pérez',
        description: 'Autor del material relacionado con el correo.'
    })
    material_author?: string;

    /** Enlace al material */
    @IsString()
    @ApiProperty({
        required: false,
        example: 'https://example.com/material',
        description: 'Enlace al material relacionado con el correo.'
    })
    link?: string;

    /** Rol anterior del usuario (si aplica) */
    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false,
        example: 'estudiante',
        description: 'Rol anterior del usuario cuando aplica un cambio de rol.'
    })
    oldRole?: string;

    /** Nuevo rol del usuario (si aplica) */
    @IsString()
    @IsOptional()
    @ApiProperty({
        required: false,
        example: 'tutor',
        description: 'Nuevo rol asignado al usuario.'
    })
    newRole?: string;

    /** Materia relacionada (cuando la plantilla lo requiere) */
    @IsString()
    @IsOptional()
    materia?: string;

    @IsString()
    @IsOptional()
    fileName?: string;

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

    @IsString()
    @IsOptional()
    nombreGrupo?: string;

}
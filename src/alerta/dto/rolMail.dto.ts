import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 *  Datos necesarios para enviar un correo basado en rol 
 */
export class RolMailDto {

    /** Rol destinatario del correo */
    @IsString()
    @ApiProperty({
        example: 'estudiante',
        description: 'Nombre del rol cuyos usuarios recibirán el correo.'
    })
    rol!: string;

    /** Nombre de la plantilla a usar */
    @IsString()
    @ApiProperty({
        example: 'nuevoMaterialSubido',
        description: 'Plantilla que se utilizará para construir el correo.'
    })
    template!: string;

    /** Texto breve que resume el mensaje */
    @IsString()
    @ApiProperty({
    required: false,
    example: 'Resumen del correo',
    description: 'Texto breve que describe el contenido del correo.'
     })
    resumen!: string;

    /** Indica si la notificación debe guardarse */
    @IsBoolean()
    @ApiProperty({
        required: false,
        example: true,
        description: 'Si es true, se registra una notificación en la BD.'
    })
    guardar!: boolean;

    /** Define si realmente se debe enviar el correo */
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    @ApiProperty({
        required: false,
        example: true,
        description: 'Si es true, se envía el correo. Por defecto es true.'
    })
    mandarCorreo?: boolean = true;

    /** Nombre del material */
    @IsString()
    @ApiProperty({
        required: false,
        example: 'Introducción a la Programación',
        description: 'Nombre del material relacionado con el correo.'
    })
    material_name?: string;

    /** Asunto del material */
    @IsString()
    @ApiProperty({
        required: false,
        example: 'Fundamentos de Programación',
        description: 'Asunto del material relacionado con el correo.'
    })
    material_subject?: string;

    //opcionales

    /** Tema del material */
    @IsString()
    @ApiProperty({
        required: false,
        example: 'Programación Básica',
        description: 'Tema del material relacionado con el correo.'
    })
    material_topic?: string;

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

}
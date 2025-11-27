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

}
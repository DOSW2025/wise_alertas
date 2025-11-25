import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 *  Datos necesarios para enviar un correo basado en rol 
 */
export class RolMailDto {

    /** Rol destinatario del correo */
    @IsString()
    @ApiProperty({ example: 'estudiante' })
    rol!: string;

    /** Nombre de la plantilla a usar */
    @IsString()
    @ApiProperty({ example: 'nuevoMaterialSubido' })
    template!: string;

    /** Texto breve que resume el mensaje */
    @IsString()
    @ApiProperty({ required: false, example: 'Resumen del correo' })
    resumen!: string;

    /** Indica si la notificación debe guardarse */
    @IsBoolean()
    @ApiProperty({ required: false, example: true })
    guardar!: boolean;

    /** Define si realmente se debe enviar el correo */
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    @ApiProperty({ required: false, example: true })
    mandarCorreo?: boolean = true;

}
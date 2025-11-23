import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class RolMailDto {

    @IsString()
    @ApiProperty({ example: 'estudiante' })
    rol!: string;


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
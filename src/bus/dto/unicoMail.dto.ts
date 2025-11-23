import { IsString,IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UnicoMailDto {

    @IsString()
    @ApiProperty({ example: 'user@example.com' })
    email!: string;

    @IsString()
    @ApiProperty({ example: 'Carlos Gómez' })
    name!: string;

    @IsString()
    @ApiProperty({ example: 'nuevoMaterialSubido' })
    template!: string;

    @IsString()
    @ApiProperty({ required: false, example: 'Resumen del correo' })
    resumen!: string;

    @IsBoolean()
    @ApiProperty({ required: true, example: true })
    guardar!: boolean;
    
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    @ApiProperty({ required: false, example: true })
    mandarCorreo?: boolean = true;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, example: 'apellido' })
    oldRole?: string;

    @IsString()
    @IsOptional()
    @ApiProperty({ required: false, example: 'nuevoRol' })
    newRole?: string;

    @IsString()
    @IsOptional()
    materia?: string;

    @IsString()
    @IsOptional()
    fecha?: string;
    
    @IsString()
    @IsOptional()
    tutor?: string;

    @IsString()
    @IsOptional()
    estudiante?: string;

    @IsString()
    @IsOptional()
    mensaje?: string;

    @IsString()
    @IsOptional()
    modalidad?: string;

    @IsString()
    @IsOptional()
    hora?: string;

}
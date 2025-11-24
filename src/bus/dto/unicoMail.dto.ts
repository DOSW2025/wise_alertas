import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UnicoMailDto {

    @IsString()
    @ApiProperty({ example: 'user@example.com', required: true })
    email!: string;

    @IsString()
    @ApiProperty({ example: 'Carlos Gómez', required: true })
    name!: string;

    @IsString()
    @ApiProperty({ example: 'nuevoMaterialSubido', required: true })
    template!: string;

    @IsString()
    @ApiProperty({ required: true, example: 'Resumen del correo' })
    resumen!: string;

    @IsBoolean()
    @ApiProperty({ required: true, example: true })
    guardar!: boolean;
    
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    @ApiProperty({ required: false, example: true })
    mandarCorreo?: boolean = true;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({ required: false, example: 2025 })
    year?: number = new Date().getFullYear();

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
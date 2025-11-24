import { IsNumber, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NotificacionDto {

    @IsNumber()
    @ApiProperty({ example: 1 })
    id: number;
    
    @IsString()
    @ApiProperty({ example: 'Nuevo material subido' })
    asunto: string;

    @IsString()
    @ApiProperty({ example: 'Se ha subido un nuevo material al curso de Matemáticas.' })
    resumen: string;

    @IsString()
    @ApiProperty({ example: false })
    visto: Boolean;

    @ApiProperty({ example: '2024-06-15T12:34:56Z' })
    fechaCreacion: Date;

}
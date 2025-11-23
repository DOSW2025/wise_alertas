import { IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CorreoDto {

    @IsString()
    @ApiProperty({ example: 'user@example.com' })
    email!: string;

    @IsString()
    @ApiProperty({ example: 'Carlos Gómez' })
    name!: string;

    @IsString()
    @ApiProperty({ example: 'nuevoMaterialSubido' })
    template!: string;

}
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ example: 'Percy Jackson e o Ladrão de Raios' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ example: 'Um garoto descobre que é filho de Poseidon.' })
  @IsString()
  @IsNotEmpty()
  conteudo: string;

  @ApiPropertyOptional({ example: 'ladrao-de-raios.jpg' })
  @IsOptional()
  @IsString()
  imagemUrl?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  ordem?: number;
}

import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateArticleDto {
  @ApiPropertyOptional({ example: 'Percy Jackson e o Ladrão de Raios' })
  @IsOptional()
  @IsString()
  titulo?: string;

  @ApiPropertyOptional({ example: 'Um garoto descobre que é filho de Poseidon.' })
  @IsOptional()
  @IsString()
  conteudo?: string;

  @ApiPropertyOptional({ example: 'ladrao-de-raios.jpg' })
  @IsOptional()
  @IsString()
  imagemUrl?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  ordem?: number;
}

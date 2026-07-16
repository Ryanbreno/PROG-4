import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateArticleDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  conteudo?: string;

  @IsOptional()
  @IsString()
  imagemUrl?: string;

  @IsOptional()
  @IsInt()
  ordem?: number;
}

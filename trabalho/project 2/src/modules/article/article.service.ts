import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  create(dto: CreateArticleDto): Promise<Article> {
    const article = this.articleRepository.create(dto);
    return this.articleRepository.save(article);
  }

  findAll(): Promise<Article[]> {
    return this.articleRepository.find({
      order: { ordem: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articleRepository.findOne({ where: { id } });
    if (!article) {
      throw new NotFoundException(`Artigo com id ${id} não encontrado`);
    }
    return article;
  }

  async update(id: number, dto: UpdateArticleDto): Promise<Article> {
    const article = await this.findOne(id);
    Object.assign(article, dto);
    return this.articleRepository.save(article);
  }

  async remove(id: number): Promise<Article> {
    const article = await this.findOne(id);
    return this.articleRepository.remove(article);
  }
}

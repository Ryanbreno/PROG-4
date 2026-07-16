import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ArticleService } from './article.service';
import { Article } from './article.entity';

const mockArticle: Article = {
  id: 1,
  titulo: 'Título de teste',
  conteudo: 'Conteúdo de teste',
  imagemUrl: 'https://exemplo.com/imagem.png',
  ordem: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ArticleService', () => {
  let service: ArticleService;
  let repository: Repository<Article>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getRepositoryToken(Article),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    repository = module.get<Repository<Article>>(getRepositoryToken(Article));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deve criar um artigo', async () => {
    jest.spyOn(repository, 'create').mockReturnValue(mockArticle);
    jest.spyOn(repository, 'save').mockResolvedValue(mockArticle);

    const result = await service.create({
      titulo: mockArticle.titulo,
      conteudo: mockArticle.conteudo,
    });

    expect(result).toEqual(mockArticle);
    expect(repository.save).toHaveBeenCalledWith(mockArticle);
  });

  it('deve listar todos os artigos ordenados', async () => {
    jest.spyOn(repository, 'find').mockResolvedValue([mockArticle]);

    const result = await service.findAll();

    expect(result).toEqual([mockArticle]);
    expect(repository.find).toHaveBeenCalledWith({
      order: { ordem: 'ASC', createdAt: 'DESC' },
    });
  });

  it('deve retornar um artigo pelo id', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(mockArticle);

    const result = await service.findOne(1);

    expect(result).toEqual(mockArticle);
  });

  it('deve lançar NotFoundException quando o artigo não existir', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('deve atualizar um artigo existente', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(mockArticle);
    jest.spyOn(repository, 'save').mockResolvedValue({
      ...mockArticle,
      titulo: 'Título atualizado',
    });

    const result = await service.update(1, { titulo: 'Título atualizado' });

    expect(result.titulo).toBe('Título atualizado');
  });

  it('deve remover um artigo existente', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(mockArticle);
    jest.spyOn(repository, 'remove').mockResolvedValue(mockArticle);

    await service.remove(1);

    expect(repository.remove).toHaveBeenCalledWith(mockArticle);
  });
});

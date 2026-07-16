import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UserService } from '../modules/user/user.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    name: 'Ryan',
    email: 'ryan@teste.com',
    password: '',
  };

  beforeEach(async () => {
    mockUser.password = await bcrypt.hash('senha123', 10);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('token-fake'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('deve registrar um novo usuário', async () => {
    jest.spyOn(userService, 'create').mockResolvedValue(mockUser as any);

    const result = await service.register({
      name: 'Ryan',
      email: 'ryan@teste.com',
      password: 'senha123',
    });

    expect(result).toEqual({ id: 1, name: 'Ryan', email: 'ryan@teste.com' });
  });

  it('deve autenticar um usuário com credenciais válidas', async () => {
    jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser as any);

    const result = await service.login({
      email: 'ryan@teste.com',
      password: 'senha123',
    });

    expect(result).toEqual({ access_token: 'token-fake' });
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: mockUser.id,
      email: mockUser.email,
    });
  });

  it('deve lançar UnauthorizedException para usuário inexistente', async () => {
    jest.spyOn(userService, 'findByEmail').mockResolvedValue(null);

    await expect(
      service.login({ email: 'inexistente@teste.com', password: 'senha123' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('deve lançar UnauthorizedException para senha incorreta', async () => {
    jest.spyOn(userService, 'findByEmail').mockResolvedValue(mockUser as any);

    await expect(
      service.login({ email: 'ryan@teste.com', password: 'senha_errada' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});

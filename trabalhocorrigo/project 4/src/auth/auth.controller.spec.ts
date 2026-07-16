import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar authService.register ao registrar', async () => {
    const dto = { name: 'Ryan', email: 'ryan@teste.com', password: 'senha123' };
    await controller.register(dto);
    expect(authService.register).toHaveBeenCalledWith(dto);
  });

  it('deve chamar authService.login ao autenticar', async () => {
    const dto = { email: 'ryan@teste.com', password: 'senha123' };
    await controller.login(dto);
    expect(authService.login).toHaveBeenCalledWith(dto);
  });
});

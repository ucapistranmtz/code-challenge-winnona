import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return health status "ok"', () => {
      const response = appController.getHealth();
      expect(response.status).toBe('ok');
      expect(response).toHaveProperty('timestamp');
      expect(typeof response.uptime).toBe('number');
    });
  });
});

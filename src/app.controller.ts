import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Check API health status' })
  @ApiResponse({ status: 200, description: 'API is running and healthy' })
  getHealth() {
    return this.appService.getHealth();
  }
}

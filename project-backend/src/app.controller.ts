import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  root() {
    return { success: true, message: 'TOOR-TAJA API', version: 'v1' };
  }

  @Get('/health')
  health() {
    return { success: true, status: 'ok', timestamp: new Date().toISOString() };
  }
}

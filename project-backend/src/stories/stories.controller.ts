import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

@Controller('stories')
export class StoriesController {
  @Get('image/:filename')
  getStoryImage(@Param('filename') filename: string, @Res() res: Response) {
    const imagePath = join(process.cwd(), 'upload', 'stories', filename);
    if (!existsSync(imagePath)) {
      throw new NotFoundException('Story image not found');
    }
    return res.sendFile(imagePath);
  }
}

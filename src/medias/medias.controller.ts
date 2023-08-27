import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { MediasService } from './medias.service';
import { CreateMediaDto } from './dto/create-media.dto';

@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Post()
  async create(@Body() body: CreateMediaDto) {
      return this.mediasService.create(body);  
  }

  @Get()
  findAll() {
    return this.mediasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediasService.findMedia(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: CreateMediaDto) {
    return this.mediasService.update(+id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediasService.remove(+id);
  }
}

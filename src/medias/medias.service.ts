import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediasRepository } from './medias.repository';
import { Media } from '@prisma/client';

@Injectable()
export class MediasService {
  private medias: Media;
  constructor(private readonly repository:MediasRepository) {
  }
  async create(body: CreateMediaDto) {
    const { title, username } = body;
    return await this.repository.create(body);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findMedia(id: number) {
    return await this.repository.findMediaById(id);
  }

  async update(id: number, body: CreateMediaDto) {
    return await this.repository.update(id, body);
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }
}

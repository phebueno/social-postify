import {
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediasRepository } from './medias.repository';
import { Media } from '@prisma/client';
import { PublicationsRepository } from '../publications/publications.repository';

@Injectable()
export class MediasService {
  private medias: Media;
  constructor(
    private readonly repository: MediasRepository,    
  ) {}

  async create(body: CreateMediaDto) {
    const medias = await this.repository.findAll();
    for (const media of medias) {
      if (media.title === body.title && media.username === body.username) {
        throw new ConflictException(
          'This user/title combination already exists!', // Encontrou um match
        ); 
      }
    }
    return await this.repository.create(body);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findMedia(id: number) {
    const media = await this.repository.findMediaById(id);
    if (!media) throw new NotFoundException('Media not found!');
    const { posts, ...mediaInfo } = media;
    return mediaInfo;
  }

  async update(id: number, body: CreateMediaDto) {
    const media = await this.repository.findMediaById(id);
    if (!media) throw new NotFoundException('Media not found!');
    const medias = await this.repository.findAll();
    for (const media of medias) {
      if (media.title === body.title && media.username === body.username) {
        throw new ConflictException(
          'This user/title combination already exists!',
        ); // Encontrou uma correspondência
      }
    }
    return await this.repository.update(id, body);
  }

  async remove(id: number) {
    const media = await this.repository.findMediaById(id);
    if (!media) throw new NotFoundException('Media not found!');
    if (media.posts.length !== 0) throw new ForbiddenException("Already posted!");
    return await this.repository.remove(id);
  }
}

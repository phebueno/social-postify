import { Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediasRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateMediaDto) {    
    return this.prisma.media.create({ data });
  }

  findAll() {
    return this.prisma.media.findMany();
  }

  findMediaById(id: number) {
    return this.prisma.media.findFirst({
      include: { posts: true },
      where: { id },
    });
  }

  update(id: number, data: CreateMediaDto) {
    return this.prisma.media.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.media.delete({ where: { id } });
  }

  findPublicationByMediaId(mediaId: number) {
    return this.prisma.publication.findFirst({ where: { mediaId } });
  }
}

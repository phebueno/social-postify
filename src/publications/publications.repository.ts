import { Injectable } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePublicationDto) {
    return this.prisma.publication.create({ data });
  }

  findAll() {
    return this.prisma.publication.findMany();
  }

  findOne(id: number) {
    return this.prisma.publication.findFirst({ where: { id } });
  }

  update(id: number, data: CreatePublicationDto) {
    return this.prisma.publication.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.publication.delete({ where: { id } });
  }
}

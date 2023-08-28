import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { PostsRepository } from '../posts/posts.repository';
import { MediasRepository } from '../medias/medias.repository';
import { getPublicationByPublishedStatus } from '../utils/publication-utils';

@Injectable()
export class PublicationsService {
  constructor(
    private readonly repository: PublicationsRepository,
    private readonly postsRepository: PostsRepository,
    private readonly mediasRepository: MediasRepository,
  ) {}

  async create(body: CreatePublicationDto) {
    const post = await this.postsRepository.findOne(body.postId);
    const media = await this.mediasRepository.findMediaById(body.mediaId);
    if (!post || !media) throw new NotFoundException('Post/media not found!');
    return await this.repository.create(body);
  }

  async findAll(published: string, after: string) {
    const publications = await this.repository.findAll();
    if(published || after){
      const filteredPubs = getPublicationByPublishedStatus(publications, published, after);
      return filteredPubs;
    } 
    return publications;
  }

  async findOne(id: number) {
    const publication = await this.repository.findOne(id);
    if (!publication) throw new NotFoundException('Publication not found!');
    return publication;
  }

  async update(id: number, body: CreatePublicationDto) {
    const publication = await this.repository.findOne(id);
    if (!publication) throw new NotFoundException('Publication not found!');
    if (publication.date < new Date(Date.now())) throw new ForbiddenException('Already published!');
    const post = await this.postsRepository.findOne(body.postId);
    const media = await this.mediasRepository.findMediaById(body.mediaId);
    if (!post || !media) throw new NotFoundException('Post/media not found!');
    return await this.repository.update(id, body);
  }

  async remove(id: number) {
    const publication = await this.repository.findOne(id);
    if (!publication) throw new NotFoundException('Publication not found!');
    return await this.repository.remove(id);
  }
}

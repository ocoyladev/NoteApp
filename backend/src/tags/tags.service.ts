import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  create(createTagDto: CreateTagDto) {
    const tag = this.tagsRepository.create(createTagDto);
    return this.tagsRepository.save(tag);
  }

  findAll() {
    return this.tagsRepository.find();
  }

  async findOne(id: number) {
    const tag = await this.tagsRepository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return tag;
  }

  // Buscar etiquetas por nombre
  async findByName(name: string): Promise<Tag[]> {
    return this.tagsRepository
      .createQueryBuilder('tag')
      .where('LOWER(tag.name) = LOWER(:name)', {name}) // Búsqueda insensible a mayúsculas/minúsculas
      .getMany();
  }

  async update(id: number, updateTagDto: Partial<CreateTagDto>) {
    const tag = await this.findOne(id);
    Object.assign(tag, updateTagDto);
    return this.tagsRepository.save(tag);
  }

  async remove(id: number) {
    const tag = await this.findOne(id);
    return this.tagsRepository.remove(tag);
  }
}
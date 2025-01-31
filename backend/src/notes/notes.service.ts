import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { Tag } from '../tags/entities/tag.entity';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  create(createNoteDto: CreateNoteDto) {
    const note = this.notesRepository.create(createNoteDto);
    return this.notesRepository.save(note);
  }

  findAll() {
    return this.notesRepository.find({ relations: ['tags'] });
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException('Invalid note ID');
    }
    const note = await this.notesRepository.findOne({ 
      where: { id },
      relations: ['tags']
    });
    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }
    return note;

  }

  async search(query: string): Promise<Note[]> {
    return this.notesRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.tags', 'tag')
      .where('LOWER(note.title) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(note.content) LIKE LOWER(:query)', { query: `%${query}%` })
      .orWhere('LOWER(tag.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .getMany();
  }

  async update(id: number, updateData: { title?: string; content?: string; tags?: Tag[] }) {
    const note = await this.findOne(id);
  
    // Actualiza solo el título y el contenido
    if (updateData.title) {
      note.title = updateData.title;
    }
    if (updateData.content) {
      note.content = updateData.content;
    }
    // Actualiza las etiquetas si se proporcionan
    if (updateData.tags) {
      const tags = await this.tagsRepository.findBy({ id: In(updateData.tags.map(tag => tag.id)) });
      note.tags = tags;
    }
  
    return this.notesRepository.save(note);
  }

  async remove(id: number) {
    const note = await this.findOne(id);
    return this.notesRepository.remove(note);
  }

  async addTags(id: number, tagIds: number[]) {
    const note = await this.findOne(id);
    const tags = await this.tagsRepository.findBy({id: In(tagIds)});
    note.tags = [...note.tags, ...tags];
    return this.notesRepository.save(note);
  }

  async removeTags(id: number, tagIds: number[]) {
    const note = await this.findOne(id);
    note.tags = note.tags.filter(tag => !tagIds.includes(tag.id));
    return this.notesRepository.save(note);
  }

  async archive(id: number) {
    const note = await this.findOne(id);
    note.archived = true;
    return this.notesRepository.save(note);
  }

  async unarchive(id: number) {
    const note = await this.findOne(id);
    note.archived = false;
    return this.notesRepository.save(note);
  }
}
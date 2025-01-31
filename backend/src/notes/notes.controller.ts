import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, Put } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateTagsDto } from './dto/update-tags.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Tag } from 'src/tags/entities/tag.entity';

@ApiTags('notes')
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  create(@Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes' })
  findAll() {
    return this.notesService.findAll();
  }
  
  @Get('search')
  @ApiOperation({ summary: 'Search notes by title, content, or tags' })
  search(@Query('query') query: string) {
    if (!query || typeof query !== 'string') {
      throw new BadRequestException('Query parameter is required and must be a string');
    }
    return this.notesService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a note by id' })
  findOne(@Param('id') id: string) {
    
    return this.notesService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a note' })
  update(@Param('id') id: string, @Body() updateData: { title?: string; content?: string, tags?: Tag[] }) {
    return this.notesService.update(+id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  remove(@Param('id') id: string) {
    return this.notesService.remove(+id);
  }

  @Post(':id/tags')
  @ApiOperation({ summary: 'Add tags to a note' })
  addTags(@Param('id') id: string, @Body() updateTagsDto: UpdateTagsDto) {
    return this.notesService.addTags(+id, updateTagsDto.tagIds);
  }

  @Delete(':id/tags')
  @ApiOperation({ summary: 'Remove tags from a note' })
  removeTags(@Param('id') id: string, @Body() updateTagsDto: UpdateTagsDto) {
    return this.notesService.removeTags(+id, updateTagsDto.tagIds);
  }

  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archive a note' })
  archive(@Param('id') id: string) {
    return this.notesService.archive(+id);
  }

  @Patch(':id/unarchive')
  @ApiOperation({ summary: 'Unarchive a note' })
  unarchive(@Param('id') id: string) {
    return this.notesService.unarchive(+id);
  }
}
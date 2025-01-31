import { Controller, Get, Post, Body, Patch, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  // @Get()
  // @ApiOperation({ summary: 'Get all tags' })
  // findAll() {
  //   return this.tagsService.findAll();
  // }

  @Get()
  @ApiOperation({ summary: 'Get all tags or search tags by name' })
  @ApiQuery({ name: 'name', required: false, description: 'Filter tags by name' })
  async findAll(@Query('name') name?: string) {
    if (name) {
      const tags = await this.tagsService.findByName(name);
      if (!tags || tags.length === 0) {
        throw new NotFoundException(`No tags found with name: ${name}`);
      }
      return tags;
    }
    return this.tagsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tag by id' })
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tag' })
  update(@Param('id') id: string, @Body() updateTagDto: Partial<CreateTagDto>) {
    return this.tagsService.update(+id, updateTagDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tag' })
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}
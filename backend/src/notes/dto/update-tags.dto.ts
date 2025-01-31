import { IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTagsDto {
  @ApiProperty({ type: [Number] })
  @IsArray()
  tagIds: number[];
}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { NotesModule } from './notes/notes.module';
import { TagsModule } from './tags/tags.module';
import { User } from './users/entities/user.entity';
import { Note } from './notes/entities/note.entity';
import { Tag } from './tags/entities/tag.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '4152963125',
      database: 'notes_db',
      entities: [User, Note, Tag],
      synchronize: true,
    }),
    UsersModule,
    NotesModule,
    TagsModule,
    AuthModule
  ],
})
export class AppModule {}
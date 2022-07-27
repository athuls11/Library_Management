import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { BooksModule } from 'src/books/books.module';
import { UsersModule } from 'src/users/users.module';
import { PublishBookDetails } from './schemas/publish-book.schema';
import { PublishBookService } from './service/publish-book.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      {
        name: 'Publish_books',
        schema: PublishBookDetails,
      },
    ]),
    AuthModule,
    BooksModule
  ],
  providers: [PublishBookService],
  exports: [PublishBookService],
})
export class PublishBookModule {}

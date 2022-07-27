import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { BooksModule } from './books/books.module';
import { PublishBookModule } from './publish-book/publish-book.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/User_db'),
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    BooksModule,
    PublishBookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { Tweet } from './entities/tweet.entity'
import { User } from './entities/user.entity'
import { UsersModule } from './users/users.module'
import { TweetController } from './tweet/tweet.controller';
import { TweetService } from './tweet/tweet.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      database: `tweeter_${process.env.NODE_ENV}`,
      entities: [User, Tweet],
      synchronize: true
    }),
    UsersModule
  ],
  controllers: [AppController, TweetController],
  providers: [AppService, TweetService]
})
export class AppModule {}

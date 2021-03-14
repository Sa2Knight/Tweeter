import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { TweetController } from './tweet/tweet.controller'
import { TweetService } from './tweet/tweet.service'
import { AuthModule } from './auth/auth.module'
import { FollowingsController } from './followings/followings.controller'
import { FollowingsService } from './followings/followings.service'
import { BookmarkController } from './bookmark/bookmark.controller'
import { BookmarkService } from './bookmark/bookmark.service'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      database: `tweeter_${process.env.NODE_ENV}`,
      entities: [__dirname + '/**/*.entity.{js,ts}'],
      synchronize: true
    }),
    UsersModule,
    AuthModule
  ],
  controllers: [AppController, TweetController, FollowingsController, BookmarkController],
  providers: [AppService, TweetService, FollowingsService, BookmarkService]
})
export class AppModule {}

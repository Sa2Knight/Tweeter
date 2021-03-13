import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request
} from '@nestjs/common'
import { Request as RequestType } from 'express'
import { AuthGuard } from '@nestjs/passport'
import { CreateTweetPropertyDto } from './createTweetProperty.dto'
import { TweetService } from './tweet.service'
import { User } from '../entities/user.entity'

@Controller('tweets')
export class TweetController {
  constructor(private tweetService: TweetService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(ValidationPipe)
  async createTweet(@Request() req: RequestType, @Body() tweetPropertyDto: CreateTweetPropertyDto) {
    return this.tweetService.create(req.user as User, tweetPropertyDto)
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteTweet(@Request() req: RequestType, @Param('id', ParseIntPipe) id: number) {
    return this.tweetService.delete(req.user as User, id).then(() => ({ result: 'success' }))
  }
}

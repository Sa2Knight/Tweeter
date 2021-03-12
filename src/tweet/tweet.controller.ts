import { Body, Controller, Delete, Param, ParseIntPipe, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateTweetPropertyDto } from './createTweetProperty.dto'
import { TweetService } from './tweet.service'

@Controller('tweets')
export class TweetController {
  constructor(private tweetService: TweetService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createTweet(@Body() tweetPropertyDto: CreateTweetPropertyDto) {
    return this.tweetService.create(tweetPropertyDto)
  }

  @Delete('/:id')
  deleteTweet(@Param('id', ParseIntPipe) id: number) {
    return this.tweetService.delete(id).then(() => ({ result: 'success' }))
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { User } from '../entities/user.entity'
import { Tweet } from '../entities/tweet.entity'
import { CreateTweetPropertyDto } from './createTweetProperty.dto'

@Injectable()
export class TweetService {
  async create(tweetPropertyDto: CreateTweetPropertyDto): Promise<Tweet> {
    const user = await User.findOneOrFail(tweetPropertyDto.userId).catch(e => {
      throw new NotFoundException('User not found')
    })
    const newTweet = Tweet.create({ user: user, text: tweetPropertyDto.text })
    return Tweet.save(newTweet).catch(e => {
      throw new BadRequestException('Failed to create Tweet')
    })
  }
}

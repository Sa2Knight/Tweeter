import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { User } from '../entities/user.entity'
import { Tweet } from '../entities/tweet.entity'
import { CreateTweetPropertyDto } from './createTweetProperty.dto'

@Injectable()
export class TweetService {
  async create(user: User, tweetPropertyDto: CreateTweetPropertyDto): Promise<Tweet> {
    const newTweet = Tweet.create({ user: user, text: tweetPropertyDto.text })
    return Tweet.save(newTweet).catch(e => {
      throw new BadRequestException('Failed to create Tweet')
    })
  }

  async delete(user: User, id: number): Promise<Tweet> {
    const tweet = await Tweet.findOneOrFail({ id, user }).catch(e => {
      throw new NotFoundException('Tweet not found')
    })
    return tweet.remove()
  }
}

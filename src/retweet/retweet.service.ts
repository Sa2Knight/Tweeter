import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Retweet } from 'src/entities/retweet.entity'
import { Tweet } from 'src/entities/tweet.entity'
import { User } from 'src/entities/user.entity'
import { DeleteResult } from 'typeorm'

@Injectable()
export class RetweetService {
  async create(fromUser: User, tweetId: number): Promise<Retweet> {
    const tweet = await this.findTweet(tweetId)
    return Retweet.create({ user: fromUser, tweet: tweet })
      .save()
      .catch(e => {
        throw new BadRequestException('Failed to create retweet')
      })
  }

  async delete(fromUser: User, tweetId: number): Promise<Retweet> {
    const tweet = await this.findTweet(tweetId)
    const retweet = await this.findRetweet(fromUser, tweet)
    return (await retweet.remove()).save()
  }

  private async findRetweet(user: User, tweet: Tweet): Promise<Retweet> {
    return Retweet.findOneOrFail({ user, tweet }).catch(e => {
      throw new NotFoundException('Retweet not found')
    })
  }

  private async findTweet(id: number): Promise<Tweet> {
    return Tweet.findOneOrFail(id).catch(e => {
      throw new NotFoundException('Tweet not found')
    })
  }
}

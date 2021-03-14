import { Injectable, NotFoundException } from '@nestjs/common'
import { Tweet } from 'src/entities/tweet.entity'
import { User } from 'src/entities/user.entity'

@Injectable()
export class BookmarkService {
  async create(fromUser: User, tweetId: number) {}

  async delete(fromUser: User, tweetId: number) {}

  private async findTweet(id: number): Promise<Tweet> {
    return Tweet.findOneOrFail(id).catch(e => {
      throw new NotFoundException('Tweet not found')
    })
  }
}

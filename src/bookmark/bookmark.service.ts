import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Bookmark } from 'src/entities/bookmark.entity'
import { Tweet } from 'src/entities/tweet.entity'
import { User } from 'src/entities/user.entity'
import { DeleteResult } from 'typeorm'

@Injectable()
export class BookmarkService {
  async create(fromUser: User, tweetId: number): Promise<Bookmark> {
    const tweet = await this.findTweet(tweetId)
    return Bookmark.create({ user: fromUser, tweet: tweet })
      .save()
      .catch(e => {
        throw new BadRequestException('Failed to create bookmark')
      })
  }

  async delete(fromUser: User, tweetId: number): Promise<Bookmark> {
    const tweet = await this.findTweet(tweetId)
    const bookmark = await this.findBookmark(fromUser, tweet)
    return (await bookmark.remove()).save()
  }

  private async findBookmark(user: User, tweet: Tweet): Promise<Bookmark> {
    return Bookmark.findOneOrFail({ user, tweet }).catch(e => {
      throw new NotFoundException('Bookmark not found')
    })
  }

  private async findTweet(id: number): Promise<Tweet> {
    return Tweet.findOneOrFail(id).catch(e => {
      throw new NotFoundException('Tweet not found')
    })
  }
}

import { IsNotEmpty, IsNumber } from 'class-validator'

export class DeleteBookmarkPropertyDto {
  @IsNotEmpty()
  @IsNumber()
  tweetId!: number
}

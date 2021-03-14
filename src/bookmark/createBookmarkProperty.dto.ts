import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateBookmarkPropertyDto {
  @IsNotEmpty()
  @IsNumber()
  tweetId!: number
}

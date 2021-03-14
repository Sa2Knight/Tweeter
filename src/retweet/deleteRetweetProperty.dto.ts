import { IsNotEmpty, IsNumber } from 'class-validator'

export class DeleteRetweetPropertyDto {
  @IsNotEmpty()
  @IsNumber()
  tweetId!: number
}

import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateRetweetPropertyDto {
  @IsNotEmpty()
  @IsNumber()
  tweetId!: number
}

import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateTweetPropertyDto {
  @IsNotEmpty()
  @IsString()
  text!: string
}

import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateTweetPropertyDto {
  @IsNotEmpty()
  @IsNumber()
  userId!: number // TODO: いずれは不要になる

  @IsNotEmpty()
  @IsString()
  text!: string
}

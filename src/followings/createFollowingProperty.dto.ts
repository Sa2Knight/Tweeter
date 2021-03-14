import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateFollowingPropertyDto {
  @IsNotEmpty()
  @IsNumber()
  userId!: number
}

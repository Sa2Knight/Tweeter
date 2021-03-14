import { IsNotEmpty, IsNumber } from 'class-validator'

export class DeleteFollowingPropertyDto {
  @IsNotEmpty()
  @IsNumber()
  userId!: number
}

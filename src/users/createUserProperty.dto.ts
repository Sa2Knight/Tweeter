import { IsNotEmpty, IsString } from 'class-validator'

export class CreateUserPropertyDto {
  @IsNotEmpty()
  @IsString()
  name!: string

  @IsNotEmpty()
  @IsString()
  displayName!: string

  @IsString()
  description?: string
}

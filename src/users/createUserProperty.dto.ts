import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateUserPropertyDto {
  @IsNotEmpty()
  @IsString()
  name!: string

  @IsNotEmpty()
  @IsString()
  displayName!: string

  @IsString()
  @IsOptional()
  description?: string
}

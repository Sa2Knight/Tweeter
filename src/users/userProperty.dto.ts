import { IsNotEmpty, IsString } from 'class-validator'

export class UserPropertyDto {
  @IsNotEmpty()
  @IsString()
  name!: string

  @IsNotEmpty()
  @IsString()
  displayName!: string

  @IsString()
  description?: string
}

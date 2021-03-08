import { IsOptional, IsString } from 'class-validator'

export class UpdateUserPropertyDto {
  @IsString()
  @IsOptional()
  displayName?: string

  @IsString()
  @IsOptional()
  description?: string
}

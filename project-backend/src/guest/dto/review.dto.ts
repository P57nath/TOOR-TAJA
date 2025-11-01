import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class ReviewDto {
  @IsString() @IsNotEmpty() guestName: string;
  @IsInt() @Min(1) @Max(5) rating: number;
  @IsOptional() @IsString() comment?: string;
}
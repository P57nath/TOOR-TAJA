import { IsBooleanString, IsInt, IsOptional, IsString, Min} from 'class-validator';

export class PageQueryDto {
  @IsOptional() @IsInt({ message: 'page must be int' }) @Min(1) page?: number = 1;
  @IsOptional() @IsInt({ message: 'limit must be int' }) @Min(2) limit?: number = 20;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() role?: string;         // filter
  @IsOptional() @IsBooleanString() active?: string; // "true" | "false"
}

export class AuditQueryDto {
  @IsOptional() @IsString() type?: 'login' | 'role-change' | 'delete' | 'create';
  @IsOptional() @IsString() from?: string; 
  @IsOptional() @IsString() to?: string;  
}

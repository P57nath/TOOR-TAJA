import { Role } from '../enums/role';
export class Admin {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}


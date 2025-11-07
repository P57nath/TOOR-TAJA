import { Role } from '../enums/role';
export class Admin {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  role: Role;
  profileName?: string;//new added for profile
  createdAt: Date;
  updatedAt: Date;
}


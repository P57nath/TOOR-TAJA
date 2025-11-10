import { Role } from '../enums/role';
export class Admin {
  id: string;
  email: string;
  name: string;
  nid: string;
  isActive: boolean;
  role: Role;
  profileName?: string;
  createdAt: Date;
  updatedAt: Date;
}


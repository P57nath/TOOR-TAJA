export class Admin {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  role: 'superadmin' | 'manager' | 'support';
  createdAt: Date;
  updatedAt: Date;
}


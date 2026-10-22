import { UserRole } from './enum';
import { RefundRequest } from './refund-request';

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  employeeCode: string;
  role: UserRole;
  active?: boolean;

  systemConfig?: boolean;
}

export interface RequestWithUser extends RefundRequest {
  user: User;
}



// VS Code counter: 16 code lines (22/10/2026)

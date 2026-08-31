import { UserRole } from './enum';

export interface User {
    id: string;
    name: string;
    surname: string;
    email: string;
    employeeCode: string;
    role: UserRole;  
    active?: boolean; 
}




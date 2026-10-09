import { UserRole } from './enum';

export interface User {
    id: string;     
    name: string;
    surname: string;
    email: string;
    password: string; 
    employeeCode: string;   
    role: UserRole;  
    active?: boolean; 
}


// VS Code counter: 11 code lines (08/10/2026)

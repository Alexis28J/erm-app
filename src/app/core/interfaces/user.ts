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

    systemConfig?: boolean;  
}



// VS Code counter: 12 code lines (13/10/2026)

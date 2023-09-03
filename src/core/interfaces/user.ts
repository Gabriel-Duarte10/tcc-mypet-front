import { BaseEntity } from "./commons";

export interface User extends BaseEntity {
  name: string;
  email: string;
  admin: boolean;
  cellphone?: boolean;
  foto?: string;
}
export interface UserRegistration {
  name: string;
  email: string;
  password: string;
  cellphone: string;
}

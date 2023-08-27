import { BaseEntity } from "./commons";

export interface User extends BaseEntity {
  name: string;
  email: string;
  admin: boolean;
  cellphone?: boolean;
}

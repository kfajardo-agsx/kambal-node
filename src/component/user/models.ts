import { Optional } from 'sequelize'

export interface Users {
  id?: string;
  username: string;
  encryptedPassword: string;
  userRole?: string;
  customerId?: string;
}

export interface CreateRequest extends Optional<Users, 'id' | 'encryptedPassword'> {
  password: string;
}
export interface LoginRequest {
  username: string;
  password: string;
}
export interface UpdateRequest {
    username: string;
    oldPassword: string;
    newPassword: string;
}
export interface DeleteRequest {
  username: string;
}
export interface GetRequest {
  username: string;
}

'use server';

export interface IUser {
  id?: string;
  name: string;
  phone: string;
  medical_id: string;
  medical_id_photo: string;
  created_at: string;
  email: string;
  package_name: string;
}

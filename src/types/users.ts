'use server';

export interface IUser {
  id: String;
  name: String;
  phoneNumber:String;
  email: String;
  medicalId: String;
  medicalIdImageUrl: String;
  packageName: String;
  packageId: String;
  creationTime: String;
  isAccepted: Boolean
}

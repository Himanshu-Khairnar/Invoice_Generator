export interface User {
  _id: string;
  Fullname: string;
  Email: string;
  Password: string;
  ProfilePicture?: string;
  Provider?: string;
  ProviderId?: string;
  CreatedAt: Date;
  UpdatedAt: Date;
}

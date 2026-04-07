import { Document, Types } from "mongoose";

export interface userModels extends Document{
    name
email
phone
password
role
}
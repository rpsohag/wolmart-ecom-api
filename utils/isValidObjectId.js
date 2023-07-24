import { Types } from "mongoose";

export function isValidObjectId(id) {
  return Types.ObjectId.isValid(id);
}
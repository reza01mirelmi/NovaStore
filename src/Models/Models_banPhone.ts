import { Schema, model } from "mongoose";
import { banModels } from "../Types/banPhone";

const BanPhoneSchema = new Schema<banModels>(
  {
    phone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "BanPhone" }
);

BanPhoneSchema.set("toJSON", { virtuals: true });
BanPhoneSchema.set("toObject", { virtuals: true });

export default model<banModels>("BanPhone", BanPhoneSchema);

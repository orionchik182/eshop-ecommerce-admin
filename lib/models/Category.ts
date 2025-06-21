import { model, Schema, models } from "mongoose";

const PropertySchema = new Schema(
  {
    name: { type: String, required: true },
    value: { type: [String], required: true },
  },
  { _id: false }               // отдельные _id для вложенных объектов не нужны
);

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    properties: [PropertySchema]
  },
  {
    timestamps: true,
  },
);

export default models.Category || model("Category", CategorySchema);

import { model, Schema, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  },
  {
    timestamps: true,
  },
);

export default models.Category || model("Category", CategorySchema);

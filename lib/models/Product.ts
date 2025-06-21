import { model, Schema, models } from "mongoose";

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    price: { type: Number, required: true },
    images: [String],
  },
  {
    timestamps: true,
  },
);

export default models.Product || model("Product", ProductSchema);

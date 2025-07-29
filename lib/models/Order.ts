import { model, models, Schema } from "mongoose";

const OrderSchema = new Schema(
  {
    line_items: { type: Object, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    streetAddress: { type: String, required: true },
    country: { type: String, required: true },
    paid: { type: Boolean },
  },
  { timestamps: true }
);

export default models.Order || model("Order", OrderSchema);

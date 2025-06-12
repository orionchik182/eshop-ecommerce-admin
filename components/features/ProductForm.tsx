import { createProduct, updateProduct } from "@/lib/actions";

export default function ProductForm({
  product,
}: {
  product?: ProductType | null;
}) {
  const action = product ? updateProduct : createProduct;
  return (
    <form action={action}>
      {product && <input type="hidden" name="id" value={product._id} />}
      <h2 className="mb-2 text-xl text-blue-900">
        {product ? "Edit product" : "New Product"}
      </h2>
      <label htmlFor="product">Product name</label>
      <input
        type="text"
        placeholder="product name"
        id="product"
        name="title"
        defaultValue={product?.title ?? ""}
      />
      <label htmlFor="description">Description</label>
      <textarea
        name="description"
        id="description"
        placeholder="description"
        defaultValue={product?.description ?? ""}
      ></textarea>
      <label htmlFor="price">Price (in USD)</label>
      <input
        type="number"
        placeholder="price"
        id="price"
        name="price"
        defaultValue={product?.price ?? ""}
      />
      <button className="btn-primary">Save</button>
    </form>
  );
}

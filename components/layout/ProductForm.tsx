import { createProduct, updateProduct } from "@/lib/actions";

export default function ProductForm({
  product,
}: {
  product?: ProductType | null;
}) {
  const action = product ? updateProduct : createProduct;
  return (
    <form action={action} encType="multipart/form-data">
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
      <label htmlFor="images">Photos</label>
      <div className="mb-2">
        <label className="flex h-24 w-24 cursor-pointer items-center justify-center gap-1 rounded-lg bg-gray-200 text-sm text-gray-500!">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Upload</div>
          <input
            type="file"
            className="hidden"
            name="images"
            id="images"
            accept="image/*"
            multiple
          />
        </label>
        {!product?.images?.length && <div>No photos in this product</div>}
      </div>
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

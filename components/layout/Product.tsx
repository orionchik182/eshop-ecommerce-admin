

import ConfirmDelete from "../features/ConfirmDelete";
import Image from "next/image";
import { deleteProduct } from "@/lib/actions";
import EditButton from "../ui/EditButton";

export default function Product({ product }: { product: ProductType }) {
  return (
    <tr>
      <td className="border border-blue-200 p-1">{product.title}</td>
      <td className="border border-blue-200 p-1">{product.price}</td>
      <td className="border border-blue-200 p-1">
        {product.images?.map((image, i) => (
          <Image
            src={image}
            key={i}
            width={60}
            height={60}
            alt={product.title}
          />
        ))}
      </td>
      <td className="border border-blue-200 p-1">
        <EditButton href={`/products/edit/${product._id}`} />
        <ConfirmDelete
          id={product._id}
          name={product.title}
          deleteAction={deleteProduct}
        />
      </td>
    </tr>
  );
}

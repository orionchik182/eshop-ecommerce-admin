import Layout from "@/components/layout/Layout";
import Product from "@/components/layout/Product";
import { getProducts } from "@/lib/data-service";
import Link from "next/link";

export default async function Page() {
  const products = await getProducts();
  return (
    <Layout>
      <Link
        href={"products/new"}
        className="btn-primary"
      >
        Add new product
      </Link>
      <table className="mt-2">
        <thead>
          <tr>
            <td className="bg-blue-100">Product name</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <Product product={product} key={product._id} />
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

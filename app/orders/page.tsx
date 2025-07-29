import Layout from "@/components/layout/Layout";
import Order from "@/components/layout/Order";
import { getOrders } from "@/lib/data-service";

export default async function Page() {
  const orders = await getOrders();
  
  return (
    <Layout>
      <h1 className="text-2xl">Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Order time</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <Order order={order} key={order._id?.toString()} />
            ))}
        </tbody>
      </table>
    </Layout>
  );
}

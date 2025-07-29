import React from "react";

export default function Order({ order }: { order: OrderType }) {
  return (
    <tr>
      <td>{new Date(order.createdAt).toLocaleString("ru-RU")}</td>
      <td>
        {order.name} {order.email}
        <br />
        {order.city} {order.postalCode} {order.country}
        <br />
        {order.streetAddress}
      </td>
      <td>
        {order.line_items.map((l, i) => (
          <React.Fragment key={i}>
            {l.price_data?.product_data.name} x {l.quantity}
            <br />
          </React.Fragment>
        ))}
      </td>
    </tr>
  );
}

import React from "react";
import { useLocation } from "react-router-dom";
import { CreateTable } from "./SupplierDetails";

const SupplierProductDetails = () => {
  const { state } = useLocation();
  console.log(
    "🚀 ~ file: SupplierProductDetails.jsx:7 ~ SupplierProductDetails ~ state:",
    state
  );
  const product = state.product;
  const data = state.data;
  return (
    <div style={{ width: "80%", marginLeft: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <img src={product.image} alt={product.title} width={150} height={150} />
        <h2
          style={{
            marginTop: 10,
            marginBottom: 20,
            fontWeight: 500,
            maxWidth: "50%",
          }}
        >
          {data.title}
        </h2>
      </div>
      <hr />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <p>Prices:</p>
        {data.prices.map((priceItem, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              flexDirection: "column",
              minWidth: "200px",
              padding: 10,
            }}
          >
            <p style={{ fontSize: 14 }}>{priceItem.quality}</p>
            <p style={{ fontSize: 18, fontWeight: "bold", color: "#135863" }}>
              {priceItem.price}
            </p>
          </div>
        ))}
      </div>
      <hr />
      <div>
        <h4>Lead Time</h4>
        <table style={{ borderCollapse: "collapse", width: "80%" }}>
          <tbody
            style={{
              fontSize: 14,
            }}
          >
            <tr>
              <td
                style={{
                  border: "1px solid black",
                  borderCollapse: "collapse",
                  padding: 12,
                  backgroundColor: "#dcdee7",
                }}
              >
                Quantity (Pieces)
              </td>
              {data.lead_time.map((leadTimeItem, idx) => (
                <td
                  style={{
                    border: "1px solid black",
                    borderCollapse: "collapse",
                    padding: 12,
                  }}
                >
                  {leadTimeItem.price}
                </td>
              ))}
            </tr>
            <tr>
              <td
                style={{
                  border: "1px solid black",
                  borderCollapse: "collapse",
                  padding: 12,
                  width: 150,
                  backgroundColor: "#dcdee7",
                }}
              >
                Lead Time (Days)
              </td>
              {data.lead_time.map((leadTimeItem, idx) => (
                <td
                  style={{
                    border: "1px solid black",
                    borderCollapse: "collapse",
                    padding: 12,
                  }}
                >
                  {leadTimeItem.quantity}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ width: "80%", marginTop: 16 }}>
        <h4 style={{ marginBottom: 10 }}>Essential Information</h4>
        <CreateTable item={data.essential_info} />
      </div>
      <div style={{ width: "80%", marginTop: 16 }}>
        <h4 style={{ marginBottom: 10 }}>Package Delivery</h4>
        <CreateTable item={data.package_delivery} />
      </div>
      <div style={{ width: "80%", marginTop: 16, marginBottom: 16 }}>
        <h4 style={{ marginBottom: 10 }}>Supply Ability</h4>
        <CreateTable item={data.supply_ability} />
      </div>
    </div>
  );
};

export default SupplierProductDetails;

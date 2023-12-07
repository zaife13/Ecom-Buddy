import React from "react";
import ReactCountryFlag from "react-country-flag";
import { useLocation } from "react-router-dom";
import { getCode } from "country-list";
import { Rating } from "@mui/material";

const SupplierDetails = () => {
  const { state } = useLocation();
  console.log(
    "🚀 ~ file: SupplierDetails.jsx:6 ~ SupplierDetails ~ supplier:",
    state
  );
  const supplier = state.supplier;
  const data = state.data;
  return (
    <div style={{ width: "90%", marginLeft: "1rem" }}>
      <h1 style={{ marginTop: 10, marginBottom: 10 }}>{supplier.name}</h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          fontSize: 18,
          gap: 30,
        }}
      >
        <p
          style={{
            color: "#318CE7",
            fontWeight: 400,
            fontStyle: "italic",
          }}
        >
          {supplier.isVerified ? "Verified" : ""}
        </p>

        <div>
          <ReactCountryFlag countryCode={getCode(supplier.country)} svg />
          <span style={{ marginLeft: 5 }}>{supplier.country}</span>
        </div>

        <p>Experience: {supplier.experience}</p>
        <p>Level: {supplier.level}</p>

        <p style={{ display: "flex", alignItems: "center" }}>
          <Rating
            name="simple-controlled"
            value={supplier.rating}
            precision={0.1}
            readOnly
          />
          <span>({supplier.rating})</span>
        </p>
      </div>

      <div style={{ width: "90%" }}>
        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <h3
            style={{
              backgroundColor: "#f4f4f4",
              padding: 10,
              borderRadius: 5,
              marginBottom: "10px",
            }}
          >
            Overview
          </h3>
          <div>
            <CreateTable item={data.overview} />
          </div>
        </div>

        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <h3
            style={{
              backgroundColor: "#f4f4f4",
              padding: 10,
              borderRadius: 5,
              marginBottom: "10px",
            }}
          >
            Product Capacity
          </h3>
          <div>
            {data?.production_capacity?.map((item, idx) => {
              if (item.title === "COOPERATE FACTORY INFORMATION") {
                return (
                  <>
                    <h4 style={{ marginTop: 15, marginBottom: 10 }}>{item.title}</h4>
                    <CreateTable item={item.cooperate_factory_information} />
                  </>
                );
              } else if (item.title === "Factory Information") {
                return (
                  <>
                    <h4 style={{ marginTop: 15, marginBottom: 10 }}>{item.title}</h4>
                    <CreateTable item={item.factory_information} />
                  </>
                );
              } else if (item.title === "Annual Production Capacity") {
                return (
                  <>
                    <h4 style={{ marginTop: 15, marginBottom: 10 }}>{item.title}</h4>
                    <CreateTable2 item={item.annual_prod_capacity} />
                  </>
                );
              } else if (item.title === "Production Equipment") {
                return (
                  <>
                    <h4 style={{ marginTop: 15, marginBottom: 10 }}>{item.title}</h4>
                    <CreateTable2 item={item.production_equipment} />
                  </>
                );
              } else {
                return <></>;
              }
            })}
          </div>
        </div>

        <div>
          <h3
            style={{
              backgroundColor: "#f4f4f4",
              padding: 10,
              borderRadius: 5,
              // width: "65%",
              marginBottom: "10px",
            }}
          >
            R&amp;D Capacity
          </h3>
          <div>
            {data.rnd_capacity.map((item, idx) => {
              return (
                <>
                  <h4 style={{ marginTop: 15, marginBottom: 10 }}>Trademark</h4>
                  <CreateTable2 item={item.trademark} />
                </>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 20, marginBottom: 20 }}>
          <h3
            style={{
              backgroundColor: "#f4f4f4",
              padding: 10,
              borderRadius: 5,
              // width: "65%",
              marginBottom: "10px",
            }}
          >
            Trade Capabilities
          </h3>
          <div>
            {data.trade_capability.map((item, idx) => {
              if (item.title === "Main Markets & Product(s)") {
                return (
                  <>
                    <h4 style={{ marginTop: 15, marginBottom: 10 }}>{item.title}</h4>
                    <CreateTable3 item={item.main_market_info} />
                  </>
                );
              } else if (item.title === "Trade Ability") {
                return (
                  <>
                    <h4 style={{ marginTop: 15, marginBottom: 10 }}>{item.title}</h4>
                    <CreateTable item={item.trade_ability} />
                  </>
                );
              } else if (item.title === "Business Terms") {
                return (
                  <>
                    <h4 style={{ marginTop: 15, marginBottom: 10 }}>{item.title}</h4>
                    <CreateTable item={item.business_terms} />
                  </>
                );
              } else {
                return <></>;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const CreateTable = ({ item }) => (
  <table style={{ borderCollapse: "collapse", width: "100%" }}>
    <tbody
      style={{
        fontSize: 14,
      }}
    >
      {item.map((item, idx) => {
        return (
          <tr key={idx}>
            <td
              style={{
                border: "1px solid black",
                borderCollapse: "collapse",
                padding: 12,
              }}
            >
              {item.key}
            </td>
            <td
              style={{
                border: "1px solid black",
                borderCollapse: "collapse",
                padding: 12,
              }}
            >
              {item.value === "" ? "-" : item.value}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

export const CreateTable2 = ({ item }) => {
  const entries = Object.entries(item);

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          {entries.map(([key, value], idx) => (
            <th
              key={idx}
              style={{
                fontSize: 14,
                fontWeight: "100",
                textAlign: "left",
                border: "1px solid black",
                backgroundColor: "#dcdee7",
                padding: 6,
              }}
            >
              {key}
            </th>
          ))}
        </tr>
      </thead>
      <tbody
        style={{
          fontSize: 14,
        }}
      >
        <tr>
          {entries &&
            entries.map(([key, value], idx) => {
              return (
                <td
                  key={idx}
                  style={{
                    border: "1px solid black",
                    borderCollapse: "collapse",
                    padding: 12,
                    //   minWidth: 100,
                  }}
                >
                  {value === "" ? "-" : value}
                </td>
              );
            })}
        </tr>
      </tbody>
    </table>
  );
};

export const CreateTable3 = ({ item }) => {
  const keys = Object.keys(item[0]);

  return (
    <table style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          {keys.map((key, idx) => {
            return (
              <th
                key={idx}
                style={{
                  fontSize: 14,
                  fontWeight: "100",
                  textAlign: "left",
                  border: "1px solid black",
                  backgroundColor: "#dcdee7",
                  padding: 6,
                }}
              >
                {key}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody
        style={{
          fontSize: 14,
        }}
      >
        {item &&
          item.map((obj) => {
            const entries = Object.entries(obj);
            return (
              <tr>
                {entries &&
                  entries.map(([key, value], idx) => {
                    return (
                      <td
                        key={idx}
                        style={{
                          border: "1px solid black",
                          borderCollapse: "collapse",
                          padding: 12,
                          //   minWidth: 100,
                        }}
                      >
                        {value === "" ? "-" : value}
                      </td>
                    );
                  })}
              </tr>
            );
          })}
      </tbody>
    </table>
  );
};
export default SupplierDetails;

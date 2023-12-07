import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

import { Button, Rating, TextField } from "@mui/material";
import TransitionsModal from "../../../Component/featureSection/utils/Modal/Modal";
import Styles from "./trends.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Trends = () => {
  const [keywords, setKeywords] = React.useState("");
  const [data, setData] = React.useState();
  const [queries, setQueries] = React.useState();
  const [risingQueries, setRisingQueries] = React.useState();
  const [topics, setTopics] = React.useState();

  const [rankedProducts, setRankedProducts] = React.useState();

  const [error, setError] = React.useState();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function getTrends(e) {
    e.preventDefault();
    setOpen(true);
    setRankedProducts();
    fetch(`${import.meta.env.VITE_FLASK_URL}/ecomm/trends`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        keywords: keywords,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const formattedData = Object.entries(data.trending_regions).map(
          ([key, value]) => ({
            region: key || "",
            count: value || "",
          })
        );

        const topicsArr = [];
        const obj = data.related_results.related_topics;
        topicsArr.push(Object.values(obj.rising_topic_title));
        topicsArr.push(Object.values(obj.rising_topic_type));
        topicsArr.push(Object.values(obj.top_topic_title));
        topicsArr.push(Object.values(obj.top_topic_type));

        setData(formattedData);
        setQueries(data.related_results.related_queries.top_query);
        setRisingQueries(data.related_results.related_queries.rising_query);
        setTopics(topicsArr);
        console.log(topicsArr);

        setOpen(false);
      })

      .catch((err) => {
        console.log(err);
        setError(err);
        setOpen(false);
      });
  }

  function getProducts(e) {
    e.preventDefault();
    setOpen(true);
    setData();
    setQueries();
    setRisingQueries();
    setTopics();

    fetch(`${import.meta.env.VITE_FLASK_URL}/ecomm/products/best-sellers`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRankedProducts(data);
        setOpen(false);
      })
      .catch((err) => {
        setError(err);
        setOpen(false);
      });
  }
  return (
    <div
      style={{
        width: "90%",
      }}
    >
      <h2>Find different Trends</h2>
      <div id="card" className={Styles.card}>
        <h3 style={{ marginBottom: 10 }}>Search Using Keywords</h3>

        <form style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <TextField
            label="keywords"
            id="outlined-size-small"
            size="small"
            name="asin"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
          />
          <div>
            <Button
              variant="outlined"
              color="success"
              sx={{ height: 40 }}
              type="submit"
              disabled={keywords.length === 0}
              onClick={getTrends}
            >
              Find Trends
            </Button>
          </div>
          <div>
            <Button
              variant="outlined"
              color="warning"
              sx={{ height: 40 }}
              type="submit"
              onClick={getProducts}
            >
              Find Products
            </Button>
          </div>
        </form>
      </div>

      {error && <p>{error}</p>}
      {rankedProducts &&
        rankedProducts.map((item, idx) => {
          return (
            <div key={"rp" + idx}>
              <h2 className={Styles.bestHeading}>{item.category}</h2>
              <div className={Styles.items}>
                {item.items.map((subItem, idx) => {
                  return (
                    <div className={Styles.productCard} key={idx}>
                      <img
                        src={subItem.image}
                        alt={subItem.asin}
                        className={Styles.productImage}
                      />
                      <div>
                        <p className={Styles.title}>{subItem.title}</p>
                        <div className={Styles.ratings}>
                          <p>
                            <Rating
                              name="simple-controlled"
                              value={subItem.rating}
                              precision={0.5}
                              readOnly
                              size="small"
                            />
                          </p>
                          <p>({subItem.rating_count})</p>
                        </div>
                        <p className={Styles.price}>{subItem.price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

      {data && (
        <>
          <h4
            style={{
              marginTop: "1rem",
              marginLeft: "5px",
            }}
          >
            Interest in keywords shown by regions
          </h4>
          <div className={Styles.graph}>
            <Bar
              datasetIdKey="id"
              data={{
                labels: data.map((item) => item.region),
                datasets: [
                  {
                    label: "Trending Regions",
                    data: data.map((item) => item.count),
                    backgroundColor: "#29c0d7",
                    borderColor: "#29c0d7",
                    borderWidth: 1,
                  },
                ],
              }}
            />
          </div>
        </>
      )}

      {queries && (
        <div style={{ marginBottom: "1rem" }}>
          <h4 className={Styles.heading4}>Top queries related to the keywords</h4>

          <div>
            {Object.values(queries).map((item, idx) => {
              return (
                <p key={idx} className={Styles.bubble}>
                  {item}
                </p>
              );
            })}
          </div>
        </div>
      )}

      {risingQueries && (
        <div style={{ marginBottom: "1rem" }}>
          <h4 className={Styles.heading4}>
            Recently trending queries related to the keywords
          </h4>

          <div>
            {Object.values(risingQueries).map((item, idx) => {
              return (
                <p key={idx} className={Styles.bubble2}>
                  {item}
                </p>
              );
            })}
          </div>
        </div>
      )}

      {topics && (
        <div>
          <h4 className={Styles.heading4}>Similar Topics</h4>
          <div className={Styles.similarTopics}>
            <table style={{ borderCollapse: "collapse", width: "100%" }}>
              <thead>
                <tr>
                  <th className={Styles.tableHeading}>Recent Trending Topic</th>
                  <th className={Styles.tableHeading}>Topic Type</th>
                  <th className={Styles.tableHeading}>Top Trending Topic</th>
                  <th className={Styles.tableHeading}>Topic Type</th>
                </tr>
              </thead>

              <tbody>
                {topics[0].map((item, idx) => {
                  return (
                    <tr className={Styles.tableRow} key={idx}>
                      <td className={Styles.tableElem}>{topics[0][idx] || ""}</td>
                      <td className={Styles.tableElem}>{topics[1][idx] || ""}</td>
                      <td className={Styles.tableElem}>{topics[2][idx] || ""}</td>
                      <td className={Styles.tableElem}>{topics[3][idx] || ""}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <TransitionsModal
        open={open}
        handleClose={handleClose}
        handleOpen={handleOpen}
      />
    </div>
  );
};

export default Trends;

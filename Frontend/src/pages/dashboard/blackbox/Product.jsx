import { Button, Rating } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TransitionsModal from "../../../Component/featureSection/utils/Modal/Modal";
import Style from "./product.module.css";

const Product = () => {
  const { state } = useLocation();
  const [product, setProduct] = useState("");
  const [summary, setSummary] = useState();
  const [reviews, setReviews] = useState([]);
  const [negativeReviews, setNegativeReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = React.useState(true);
  const [error, setError] = React.useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function searchProductAsin() {
    fetch(`${import.meta.env.VITE_FLASK_URL}/ecomm/products/search/${state.asin}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        url: state.url,
        asin: state.asin,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const productData = data.product;
        console.log(data);
        setProduct(productData);
        setIsLoading(false);
        setOpen(false);
        localStorage.setItem("productDetails", JSON.stringify(productData));
      })
      .catch((err) => {
        setError(err.ERROR);
        setIsLoading(false);
        setOpen(false);
      });
  }
  useEffect(() => {
    const productDetails = localStorage.getItem("productDetails");
    if (productDetails) {
      setProduct(JSON.parse(productDetails));
      setIsLoading(false);
      setOpen(false);
    } else {
      console.log("fetching");
      searchProductAsin();
    }
  }, []);

  const getReviews = async () => {
    setOpen(true);

    const rews = localStorage.getItem("reviews");
    if (rews) {
      setReviews(JSON.parse(rews));
      setIsLoading(false);
      setOpen(false);
      setNegativeReviews([]);
    } else {
      fetch(
        `${import.meta.env.VITE_FLASK_URL}/ecomm/products/${state.asin}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            reviews_link: product.reviews_link,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          const reviewsData = data.reviews;
          setReviews(reviewsData);
          console.log(reviewsData);
          setNegativeReviews([]);
          setIsLoading(false);
          setOpen(false);
          localStorage.setItem("reviews", JSON.stringify(reviewsData));
        });
    }
  };

  const findNegativeReviews = () => {
    setOpen(true);
    const rews = localStorage.getItem("negReviews");
    if (rews) {
      setNegativeReviews(JSON.parse(rews));
      setIsLoading(false);
      setOpen(false);
      setReviews([]);
    } else {
      fetch(`${import.meta.env.VITE_FLASK_URL}/ecomm/sentiment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Origin": `${import.meta.env.VITE_FLASK_URL}`,
        },
        body: JSON.stringify({
          reviews: reviews,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setNegativeReviews(data);
          setReviews([]);
          setOpen(false);
          localStorage.setItem("negReviews", JSON.stringify(data));
        })
        .catch((err) => {
          console.log(err);
          setError(err);
        });
    }
  };

  const getSummary = () => {
    setOpen(true);
    const reviewsText = negativeReviews.map((review) => review.body).join("\n");
    console.log(reviewsText);
    fetch(`${import.meta.env.VITE_FLASK_URL}/ecomm/summary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        reviewsText,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        // setReviews([]);
        // setNegativeReviews([]);
        setSummary(data);
        setOpen(false);
      });
  };

  if (isLoading) {
    return (
      <TransitionsModal
        open={open}
        handleClose={handleClose}
        handleOpen={handleOpen}
      />
    );
  }

  return (
    <>
      <TransitionsModal
        open={open}
        handleClose={handleClose}
        handleOpen={handleOpen}
      />
      {error && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <h1>{error}</h1>
        </div>
      )}
      <div className={Style.wrapper}>
        <div className={Style.mainDiv}>
          <img
            className={Style.productImg}
            src={product?.images[0]}
            alt="productImg"
          />
          <div className={Style.headerContent}>
            <h1 className={Style.title}>{product.title}</h1>

            <span style={{ marginBottom: 5 }}>
              Categories:
              <p className={Style.categories}>{state.categories || ""}</p>
            </span>
            <p className={Style.price}>
              Price:
              <span style={{ color: "red" }}> {product.price}</span>
            </p>

            <div className={Style.features}>
              <h3>Features</h3>
              {product.attributes &&
                product.attributes.map((attr, idx) => (
                  <div key={idx}>
                    <p className={Style.featureName}>{attr.name}</p>
                    <p className={Style.feature}>{attr.value}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className={Style.featureBullets}>
          <h3>Keywords list</h3>
          <ul>
            {product.keywords_list &&
              product.keywords_list.map((word, idx) => <li key={idx}>{word}</li>)}
          </ul>
        </div>

        <div className={Style.featureBullets}>
          <h3>About this item:</h3>
          <ul>
            {product.featured_bullets &&
              product.featured_bullets.map((bullet, idx) => (
                <li key={idx}>
                  <p>{bullet}</p>
                </li>
              ))}
          </ul>
        </div>

        <div className={Style.description}>
          <h3>Prodcut Description</h3>
          <p id="desc">{product.description}</p>
        </div>

        <div style={{ display: "flex", marginBottom: "1rem" }}>
          <Button
            variant="outlined"
            sx={{ marginLeft: "10px", marginTop: "1rem", color: "#1C8090" }}
            onClick={getReviews}
          >
            Find Reviews
          </Button>
          <Button
            disabled={!reviews.length}
            variant="outlined"
            color="error"
            sx={{ marginLeft: "10px", marginTop: "1rem" }}
            onClick={findNegativeReviews}
          >
            Find Negative Reviews
          </Button>
          <Button
            disabled={!negativeReviews.length}
            variant="outlined"
            color="warning"
            sx={{ marginLeft: "10px", marginTop: "1rem" }}
            onClick={getSummary}
          >
            Get Reviews Summary
          </Button>
        </div>

        {negativeReviews.length ? (
          <div className={Style.reviews}>
            <h3>Negative Reviews ({negativeReviews.length})</h3>
            {negativeReviews.map((review, idx) => (
              <div className={Style.reviewCard} key={idx}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 5,
                  }}
                >
                  <Rating
                    name="read-only"
                    value={parseInt(review.rating)}
                    precision={0.5}
                    readOnly
                  />
                  <span className={Style.author}>{review.author}</span>
                </div>
                <p>{review.body}</p>
              </div>
            ))}
          </div>
        ) : reviews.length ? (
          <div className={Style.reviews}>
            <h3>Reviews ({reviews.length})</h3>
            {reviews.map((review, idx) => (
              <div className={Style.reviewCard} key={idx}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 5,
                  }}
                >
                  <Rating
                    name="read-only"
                    value={parseInt(review.rating)}
                    precision={0.5}
                    readOnly
                  />
                  <span className={Style.author}>{review.author}</span>
                </div>
                <p className={Style.reviewBody}>{review.body}</p>
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
        <div>
          {summary && (
            <div
              style={{
                marginLeft: 15,
                maxWidth: "90%",
                marginBottom: 16,
              }}
            >
              <h3>Summary of Negative Reviews</h3>
              <p>{summary}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Product;

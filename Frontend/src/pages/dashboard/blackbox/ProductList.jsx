import React, { useState } from "react";
import ProductStyle from "./productstyle.module.css";
import Rating from "@mui/material/Rating";
import { useLocation } from "react-router-dom";

import StickyHeadTable from "../../../Component/Tables/AmazonTable";
import TransitionsModal from "../../../Component/featureSection/utils/Modal/Modal";

function ProductList() {
  const [products, setProducts] = useState("");
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { state } = useLocation();
  console.log(state);

  const search_term = state.search_term;
  // const max_page = state.pages;

  React.useEffect(() => {
    // get from localstorage if user clicked backed to this page
    const products = localStorage.getItem("products");
    if (products) {
      setProducts(JSON.parse(products));
      setOpen(false);
    } else {
      // fetch from server
      fetch(`${import.meta.env.VITE_FLASK_URL}/ecomm/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          url: `https://${state.domain}`,
          input_term: search_term,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          // const searchResults = data.search_results;
          const searchResults = data.products || [];
          console.log("🚀 ~ file: ProductList.jsx:38 ~ .then ~ data", data);
          searchResults?.forEach((result) => {
            // return (result["id"] = result["position"]);
            result["id"] = result["asin"];
            result["categories"] = result["categories"].toString();
          });
          setProducts(searchResults);
          setOpen(false);
          localStorage.setItem("products", JSON.stringify(searchResults));
        });
    }
  }, []); // <-- Have to pass in [] here!

  return (
    <>
      <div className={ProductStyle.wrapper}>
        <div className={ProductStyle.filterHeader}>
          <h1>Product List</h1>
          <p>
            Given below the filters can be applied to find out product which suits
            best as per criteria
          </p>
        </div>

        {products.length !== 0 && (
          <StickyHeadTable products={products} domain={state.domain} />
        )}
      </div>
      <TransitionsModal
        open={open}
        handleClose={handleClose}
        handleOpen={handleOpen}
      />
    </>
  );
}

export default ProductList;

import React, { useContext, useState } from "react";
import Style from "./suppliers.module.css";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import AlibabaTable from "../../../Component/Tables/AlibabaTable";
import TransitionsModal from "../../../Component/featureSection/utils/Modal/Modal";
import { AuthContext } from "../../../context/auth-context";

export function refactorData(supplierData) {
  const d = supplierData.map((supplier, idx) => ({
    id: idx,
    _id: supplier._id,
    product: {
      details: {},
      image: supplier.image,
      min_order: supplier.min_order,
      p_link: supplier.p_link,
      price_range: supplier.price_range,
      title: supplier.title,
    },
    supplier: {
      country: supplier.country,
      experience: supplier.experience,
      isVerified: supplier.isVerified,
      level: supplier.level,
      link: supplier.link,
      name: supplier.name,
      rating: supplier.rating,
    },
  }));
  return d;
}

function SuppliersList() {
  const { card, mainSubHeading, cardHeader, cardForm, muiTable, wrapper } = Style;
  const auth = useContext(AuthContext);
  const history = useNavigate();
  const [search, setSearch] = useState("");
  const [maxPage, setMaxPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState();

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    const data = localStorage.getItem("alibabaData");
    if (data) {
      setProducts(JSON.parse(data));
    }
  }, []);

  function findSuppliers(e) {
    e.preventDefault();
    setOpen(true);
    localStorage.removeItem("alibabaData");
    var data = {
      input_term: search,
      pages: maxPage || 1,
    };
    fetch(`${import.meta.env.VITE_FLASK_URL}/ecomm/suppliers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": import.meta.env.VITE_FLASK_URL,
      },
      mode: "cors",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🚀 ~ file: Supplier.jsx:52 ~ .then ~ data", data);
        localStorage.setItem("alibabaData", JSON.stringify(data.results));
        setProducts(data.results);
        setOpen(false);
      })
      .catch((err) => {
        setError(err);
        setOpen(false);
      });

    setSearch("");
  }

  function getFavorites(e) {
    e.preventDefault();
    setOpen(true);
    setProducts([]);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/ecomm/suppliers/getSuppliers`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": import.meta.env.VITE_BACKEND_URL,
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const newData = refactorData(data.data.suppliers);
        console.log("🚀 ~ file: SuppliersList.jsx:95 ~ .then ~ newData:", newData);

        // setProducts(newData);
        setOpen(false);
        localStorage.removeItem("supplierProductData");
        localStorage.removeItem("supplierData");
        history("/suppliers/favorites", { state: newData });
      })
      .catch((err) => {
        setError(err.message);
        setOpen(false);
      });
  }

  return (
    <div className={wrapper}>
      <h2 className={mainSubHeading}>Find suppliers on Alibaba</h2>
      <div className={card}>
        <div className={cardHeader}>
          <p>Enter the keywords to find the suppliers for the products</p>
        </div>
        <form className={cardForm} onSubmit={(e) => {}}>
          <TextField
            label="Search Term"
            id="outlined-size-small"
            size="small"
            name="search_term"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <TextField
            label="Max Pages"
            id="outlined-size-small"
            size="small"
            name="pages"
            value={maxPage}
            onChange={(e) => setMaxPage(e.target.value)}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          />

          <div>
            <Button
              variant="contained"
              type="submit"
              disabled={search === ""}
              onClick={findSuppliers}
            >
              Search Products
            </Button>
            <Button
              variant="outlined"
              color="error"
              sx={{ marginLeft: 5 }}
              onClick={(e) => {
                getFavorites(e);
              }}
            >
              View Favorites
            </Button>
          </div>
        </form>
      </div>
      {error && <p>{error}</p>}
      <div className={muiTable}>
        {products.length !== 0 && <AlibabaTable products={products} />}
      </div>

      <TransitionsModal
        open={open}
        handleClose={handleClose}
        handleOpen={handleOpen}
      />
    </div>
  );
}

export default SuppliersList;

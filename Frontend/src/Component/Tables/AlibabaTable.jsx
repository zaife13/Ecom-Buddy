import * as React from "react";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import styles from "./table.module.css";
import { AuthContext } from "../../context/auth-context";
import { toastError, toastSuccess } from "../../utils/toast-message";
import { ToastContainer } from "react-toastify";
import { refactorData } from "../../pages/dashboard/supplier/SuppliersList";
import TransitionsModal from "../featureSection/utils/Modal/Modal";

export default function AlibabaTable(props) {
  const history = useNavigate();
  const auth = React.useContext(AuthContext);
  const [text, setText] = React.useState({ id: "", text: "" });
  const [rows, setRows] = React.useState(props.products);

  const [error, setError] = React.useState();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const columns = [
    {
      field: "image",
      id: "image",
      headerName: "Image",
      width: 100,
      renderCell: (params) => {
        const link = params.row.product.image;
        return <img style={{ width: 80, height: 80 }} src={link} alt="Product" />;
      },
    },
    {
      field: "title",
      id: "title",
      headerName: "Title",
      width: 270,
      renderCell: (params) => {
        const title = params.row.product.title;
        return <p>{title}</p>;
      },
    },
    {
      field: "min_order",
      id: "min_order",
      headerName: "Min. Order",
      width: 100,
      renderCell: (params) => {
        const min_order = params.row.product.min_order;
        return <p style={{ paddingLeft: 10 }}>{min_order}</p>;
      },
    },
    {
      field: "price_range",
      id: "price_range",
      headerName: "Price Range",
      width: 150,
      renderCell: (params) => {
        const price_range = params.row.product.price_range;
        return <p>{price_range}</p>;
      },
    },
    {
      field: "view_product",
      id: "view_product",
      headerName: "View Product",
      width: 170,
      renderCell: (params) => {
        const product = params.row.product;
        return (
          <button
            className={styles.productBtn}
            onClick={(e) => {
              handleSupplierProductDetails(e, product);
            }}
          >
            View Product Details
          </button>
        );
      },
    },
    {
      field: "name",
      id: "name",
      headerName: "Supplier Name",
      width: 130,
      renderCell: (params) => {
        const name = params.row.supplier.name;
        return <p>{name}</p>;
      },
    },
    {
      field: "isVerified",
      id: "isVerified",
      headerName: "Verified Supplier",
      width: 130,
      renderCell: (params) => {
        const isVerified = params.row.supplier.isVerified;
        return (
          <p style={{ margin: "auto" }}>{isVerified === true ? "TRUE" : "FALSE"}</p>
        );
      },
    },
    {
      field: "level",
      id: "level",
      headerName: "Supplier Level",
      width: 110,
      renderCell: (params) => {
        const level = params.row.supplier.level;
        return <p style={{ margin: "auto" }}>Level: {level}</p>;
      },
    },
    {
      field: "rating",
      id: "rating",
      headerName: "Supplier Rating",
      width: 115,
      renderCell: (params) => {
        const rating = params.row.supplier.rating;
        return <p style={{ margin: "auto" }}>{rating || 0} stars</p>;
      },
    },
    {
      field: "prev_orders",
      id: "prev_orders",
      headerName: "Previous Order Volumes",
      width: 170,
      renderCell: (params) => {
        const prev_orders = params.row.supplier.prev_orders;
        return <p style={{ margin: "auto" }}>{prev_orders}</p>;
      },
    },
    {
      field: "view_supplier",
      id: "view_supplier",
      headerName: "View Supplier",
      width: 170,
      renderCell: (params) => {
        const supplier = params.row.supplier;
        const sId = params.row._id;
        const link = params.row.product.p_link;
        return (
          <button
            className={styles.supplierBtn}
            onClick={(e) => {
              handleSupplierDetails(e, supplier, sId, link);
            }}
          >
            View Supplier Details
          </button>
        );
      },
    },
    {
      field: "add_favorites",
      id: "add_favorites",
      headerName: "Add to Favorites",
      width: 170,
      renderCell: (params) => {
        return (
          <button
            className={text.id === params.row.id ? styles.favBtn2 : styles.favBtn}
            onClick={(e) => {
              text.text === "" || "Add to Favorites"
                ? handleFavorites(e, params.row)
                : removeFavorites(e, params.row);
            }}
          >
            {text.id === params.row.id
              ? "Remove from Favorites"
              : "Add to Favorites"}
          </button>
        );
      },
    },
  ];

  function handleSupplierDetails(e, supplier, sId, link) {
    e.preventDefault();
    setOpen(true);
    fetch(`${import.meta.env.VITE_FLASK_URL}/ecomm/suppliers/details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ url: link }),
    })
      .then((res) => res.json())
      .then((data) => {
        setOpen(false);
        history(`/suppliers/${sId}/details`, { state: { supplier, data } });
      })
      .catch((err) => setError(err));
  }

  function handleSupplierProductDetails(e, product) {
    e.preventDefault();
    setOpen(true);
    fetch(`${import.meta.env.VITE_FLASK_URL}/ecomm/suppliers/product/details`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ product_link: product.p_link }),
    })
      .then((res) => res.json())
      .then((data) => {
        setOpen(false);
        history(`/suppliers/product/details`, { state: { product, data } });
      })
      .catch((err) => setError(err));
  }

  function handleFavorites(e, prod) {
    e.preventDefault();
    const supplier = { ...prod.product, ...prod.supplier };

    console.log(supplier);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/ecomm/suppliers/addSupplier`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        ...supplier,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.user);
        setText({ id: prod.id, text: "Added to favorites" });
      })
      .catch((err) => {
        toastError(err.message);
      });
  }

  function removeFavorites(e, prod) {
    e.preventDefault();
    console.log(prod);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/ecomm/suppliers/${prod._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth.token}`,
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const newData = refactorData(data.data.suppliers);
        setRows(newData);
      });
  }

  return (
    <Paper sx={{ width: "100%", height: 500 }}>
      <ToastContainer />
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
      <TransitionsModal
        open={open}
        handleClose={handleClose}
        handleOpen={handleOpen}
      />
    </Paper>
  );
}

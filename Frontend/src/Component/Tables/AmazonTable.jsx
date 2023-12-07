import * as React from "react";
import Paper from "@mui/material/Paper";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

const columns = [
  {
    field: "image",
    id: "image",
    headerName: "Image",
    width: 100,
    renderCell: (params) => {
      const link = params.row.image;
      return (
        <img style={{ width: 40, height: 40 }} src={link} alt={params.row.asin} />
      );
    },
  },
  { field: "title", id: "title", headerName: "Title", width: 250 },
  { field: "price", id: "price", headerName: "Price", width: 100 },
  { field: "asin", id: "asin", headerName: "ASIN", minWidth: 120, width: 120 },
  {
    field: "rating",
    id: "rating",
    headerName: "Rating",
    minWidth: 70,
    width: 70,

    format: (value) => value.toLocaleString("en-US"),
  },
  {
    field: "categories",
    id: "categories",
    headerName: "Category",
    minWidth: 400,
  },
];

export default function StickyHeadTable(props) {
  const history = useNavigate();
  const rows = props.products;

  const handleRowClick = (params) => {
    console.log(params);
    localStorage.removeItem("productDetails");
    localStorage.removeItem("reviews");
    localStorage.removeItem("negReviews");
    history(`/blackbox/products/${params.row.asin}}`, {
      state: {
        asin: params.row.asin,
        domain: props.domain,
        url: `https://${props.domain}/dp/`,
        categories: params.row.categories,
      },
    });
  };
  return (
    <Paper sx={{ width: "100%", height: 460 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        checkboxSelection
        disableSelectionOnClick
        onRowClick={handleRowClick}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Paper>
  );
}

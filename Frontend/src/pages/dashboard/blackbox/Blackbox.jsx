import React, { useState } from "react";
import Style from "./blackbox.module.css";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

export default function Blackbox() {
  const {
    heading,
    subHeading,
    card,
    wrapper,
    mainSubHeading,
    cardHeader,
    cardForm,

    formActions,
  } = Style;

  const history = useNavigate();
  const [domain, setDomain] = useState("amazon.com");
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("");
  const [maxPage, setMaxPage] = useState(1);
  const [asin, setASIN] = useState("");

  function submit(e) {
    e.preventDefault();

    var data = {
      domain: domain,
      url: url,
      search_term: search,
      pages: maxPage || 1,
    };

    // console.log(data);
    localStorage.removeItem("products");
    history("/blackbox/products", { state: data });
  }

  // function getProduct(e) {
  //   e.preventDefault();
  //   var data = {
  //     domain: domain,
  //     url: url,
  //     asin: asin,
  //     pages: maxPage || 1,
  //   };
  //   history("/blackbox/products/" + asin, { state: data });
  // }

  function searchUsingASIN(e) {
    e.preventDefault();
    localStorage.removeItem("productDetails");
    localStorage.removeItem("reviews");
    localStorage.removeItem("negReviews");
    history(`/blackbox/products/${asin}}`, {
      state: {
        url: `https://${domain}/dp/`,
        asin,
      },
    });
  }

  return (
    <div className={wrapper}>
      <div>
        <p className={heading}>Black Box</p>
        <p className={subHeading}>
          Find a product to sell by evaluating products, keywords, competitors and
          more
        </p>
      </div>
      <div className={card}>
        <div className={cardHeader}>
          <p className={mainSubHeading}>Find products on</p>
          <FormControl sx={{ m: 1, minWidth: 120, marginTop: 0 }} size="small">
            <InputLabel id="demo-select-small">Domain</InputLabel>
            <Select
              labelId="demo-select-small"
              id="demo-select-small"
              value={domain}
              defaultValue="amazon.com"
              label="Domain"
              onChange={(e) => {
                setDomain(e.target.value);
              }}
            >
              <MenuItem value={"amazon.com"}>amazon.com</MenuItem>
              <MenuItem value={"amazon.cd"}>amazon.cd</MenuItem>
              <MenuItem value={"amazon.au"}>amazon.in</MenuItem>
            </Select>
          </FormControl>

          <p className={mainSubHeading}>that match your criteria</p>
        </div>
        <form className={cardForm}>
          <TextField
            label="URL"
            id="outlined-size-small"
            size="small"
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
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

          {/* <div className={formActions}> */}
          <Button
            variant="contained"
            sx={{}}
            onClick={submit}
            disabled={url === "" && search === ""}
          >
            Search Products
          </Button>
          {/* </div> */}
        </form>
      </div>

      <div className={card}>
        <h3 style={{ marginBottom: 10 }}>Search Using ASIN</h3>
        <form className={cardForm}>
          <TextField
            label="ASIN"
            id="outlined-size-small"
            size="small"
            name="asin"
            value={asin}
            onChange={(e) => setASIN(e.target.value)}
          />
          {/* <div className={formActions}> */}
          <Button
            variant="contained"
            sx={{}}
            type="submit"
            disabled={asin === ""}
            onClick={searchUsingASIN}
          >
            Search using ASIN
          </Button>
          {/* </div> */}
        </form>
      </div>
    </div>
  );
}

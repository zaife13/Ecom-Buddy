const axios = require('axios');
const HttpError = require('../utils/httpError');

const sendRequest = (params, res, next) => {
  axios
    .get('https://api.rainforestapi.com/request', { params })
    .then((response) => {
      // print the JSON response from Rainforest API
      return res.status(200).send({
        status: 'success',
        length: response.data.search_results
          ? response.data.search_results.length
          : response.data.reviews
          ? response.data.reviews.length
          : null,
        data: response.data,
      });
    })
    .catch((error) => {
      // catch and print the error
      return next(new HttpError(error, 500));
    });
};

// set up the request parameters
exports.fetchProducts = (req, res, next) => {
  const params = {
    api_key: '27AF3A23E5704BE1BA6EBA29E9A0BB66',
    type: 'search',
    amazon_domain: 'amazon.com',
    search_term: req.body.search_term,
  };

  // make the http GET request to Rainforest API
  sendRequest(params, res, next);
};

exports.fetchProductByASIN = (req, res, next) => {
  const params = {
    api_key: '27AF3A23E5704BE1BA6EBA29E9A0BB66',
    amazon_domain: 'amazon.com',
    asin: req.params.asin,
    type: 'product',
  };

  // make the http GET request to Rainforest API
  sendRequest(params, res, next);
};

exports.fetchReviews = (req, res, next) => {
  // set up the request parameters
  const params = {
    api_key: '27AF3A23E5704BE1BA6EBA29E9A0BB66',
    type: 'reviews',
    amazon_domain: 'amazon.com',
    asin: req.params.asin,
    max_page: '1',
    include_html: 'false',
  };

  // make the http GET request to Rainforest API
  sendRequest(params, res, next);
};

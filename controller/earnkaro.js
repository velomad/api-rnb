const {
    offerProductsService,
    singleProductService,
  } = require("../services/earnkaro");
  
  module.exports = {
    offerProducts: (req, res) => {
      const offer = req.query.offer;
      offerProductsService(offer, (err, results) => {
        if (results) {
          for (var i = 0; i < results.length; i++) {
            results[i].thumbnailImages =
              JSON.parse(results[i].thumbnailImages).length != 0
                ? JSON.parse(results[i].thumbnailImages)
                : null;
          }
        }
  
        if (err) {
          res.status(500).json({
            status: "error",
            message: err,
          });
        }
        return res.status(200).json({
          status: "success",
          // results: results.length,
          offers: results,
        });
      });
    },
  
    singleProduct: (req, res) => {
      const productId = req.query.id;
      singleProductService(productId, (err, results) => {
        if (results) {
          for (var i = 0; i < results.length; i++) {
            results[i].thumbnailImages =
              JSON.parse(results[i].thumbnailImages).length != 0
                ? JSON.parse(results[i].thumbnailImages)
                : null;
          }
        }
  
        if (err) {
          res.status(500).json({
            status: "error",
            message: err,
          });
        }
  
        return res.status(200).json({
          status: "success",
          // results: results.length,
          product: results[0],
        });
      });
    },
  };
  
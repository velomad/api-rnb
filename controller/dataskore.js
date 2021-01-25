const dataskoreServices = require("../services/dataskore");

module.exports = {
  products: (req, res) => {
    const queries = req.query;
    dataskoreServices.products(queries, (err, results, count) => {
      if (err) {
        res.status(500).json({
          status: "error",
          message: err,
        });
      } else {
        res.status(200).json({
          status: "success",
          category: queries.category,
          totalProducts: count[0].totalProducts,
          totalPages: Math.ceil(count[0].totalProducts / queries.limit),
          queries: queries,
          results: results.length,
          data: results,
        });
      }
    });
  },

  autocomplete: (req, res) => {
    const searchTerm = req.query.term;
    dataskoreServices.autocomplete(searchTerm, (err, results) => {
      if (err) {
        res.status(500).json({
          status: "error",
          message: err,
        });
      } else {
        const extractedSuggestions = [];
        const strResults = JSON.stringify(results);
        const objResults = JSON.parse(strResults);

        objResults.map((el) => {
          extractedSuggestions.push(el.displayCategory);
        });

        res.status(200).json({
          status: "success",
          term: req.query.term,
          results: results.length,
          suggestions: extractedSuggestions,
        });
      }
    });
  },

  searchProducts: (req, res) => {
    const queries = req.query;
    const searchTerm = req.query.term;
    dataskoreServices.searchProducts(
      queries,
      searchTerm,
      (err, results, count) => {
        if (err) {
          res.status(500).json({
            status: "error",
            message: err,
          });
        } else {
          res.status(200).json({
            status: "success",
            term: queries.term,
            totalProducts: count[0].totalProducts,
            totalPages: Math.ceil(count[0].totalProducts / queries.limit),
            results: results.length,
            result: results,
          });
        }
      }
    );
  },

  singleProduct: (req, res) => {
    const productId = req.query.id;
    dataskoreServices.singleProduct(productId, (err, results) => {
      results[0].size = JSON.parse(results[0].size);
      if (err) {
        res.status(500).json({
          status: "error",
          message: err,
        });
      } else {
        res.status(200).json({
          status: "success",
          result: results,
        });
      }
    });
  },
};

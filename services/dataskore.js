const pool = require("../db");
const qs = require("query-string");

module.exports = {
  products: (queries, cb) => {
    // destructed page and limit for pagination
    const { page, limit } = queries;

    // params that will be passed instead of " ? "
    const params = [];

    // Calculation for getting an OFFSET
    const startIndex = (page - 1) * limit;
    // const endIndex = page * limit;

    let sql = "SELECT * FROM products WHERE 1 = 1 ";
    if (queries.website) {
      sql += "AND website = ?";
      params.push(queries.website);
    }
    if (queries.category) {
      sql += "AND category = ?";
      params.push(queries.category);
    }
    if (queries.gender) {
      sql += "AND gender = ?";
      params.push(queries.gender);
    }
    if (queries.discountPercent) {
      sql += "AND discountPercent >= ?";
      params.push(queries.discountPercent.gte);
    }
    if (queries.productPrice && queries.productPrice.gte) {
      sql += "AND productPrice >= ?";
      params.push(queries.productPrice.gte);
    }
    if (queries.productPrice && queries.productPrice.lte) {
      sql += "AND productPrice <= ?";
      params.push(queries.productPrice.lte);
    }
    if (queries.sort) {
      if (queries.sort == "low") {
        sql += " ORDER BY productPrice ASC";
      } else if (queries.sort == "high") {
        sql += "ORDER BY productPrice DESC";
      } else if (queries.sort == "discount") {
        sql += "ORDER BY discountPercent DESC";
      } else if (queries.sort == "rating") {
        sql += "ORDER BY productRating DESC";
      }
    }
    if (page && limit) {
      sql += `LIMIT ${limit} OFFSET ${startIndex}`;
    }

    pool.query(sql, params, (err, results) => {
      if (err) {
        cb(err);
      } else {
        cb(null, results);
      }
    });
  },

  autocomplete: (term, cb) => {
    const sql = `Select distinct displayCategory from products where displayCategory like '${term}%' or displayCategory like '% ${term}%'`;
    pool.query(sql, (err, results) => {
      if (err) {
        cb(err);
      } else {
        cb(null, results);
      }
    });
  },

  searchProducts: (term, cb) => {
    const sql = `Select * from products where displayCategory like '%${term}%' OR displayCategory like '% ${term}%'`;

    pool.query(sql, (err, results) => {
      if (err) {
        cb(err);
      } else {
        cb(null, results);
      }
    });
  },

  singleProduct: (productId, cb) => {
    const sql = "Select * from products where id = ?";
    const params = [productId];
    pool.query(sql, params, (err, results) => {
      if (err) {
        cb(err);
      } else {
        cb(null, results);
      }
    });
  },
};

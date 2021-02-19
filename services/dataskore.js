const pool = require("../db");
const qs = require("query-string");

module.exports = {
  products: (queries, cb) => {
    // destructed page and limit for pagination
    const { page, limit } = queries;

    // params that will be passed instead of " ? "
    const params = [];

    let count;

    // Calculation for getting an OFFSET
    const startIndex = (page - 1) * limit;
    // const endIndex = page * limit;

    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }
      connection.beginTransaction((err) => {
        if (err) {
          throw err;
        }
        let countSql =
          "SELECT COUNT(id) AS totalProducts FROM products WHERE 1 = 1 ";

        if (queries.website) {
          countSql += "AND website = ?";
          params.push(queries.website);
        }
        if (queries.category) {
          countSql += "AND category = ?";
          params.push(queries.category);
        }
        if (queries.gender) {
          countSql += "AND gender = ?";
          params.push(queries.gender);
        }
        if (queries.discountPercent) {
          countSql += "AND discountPercent >= ?";
          params.push(queries.discountPercent.gte);
        }
        if (queries.productPrice && queries.productPrice.gte) {
          countSql += "AND productPrice >= ?";
          params.push(queries.productPrice.gte);
        }
        if (queries.productPrice && queries.productPrice.lte) {
          countSql += "AND productPrice <= ?";
          params.push(queries.productPrice.lte);
        }
        // if (queries.sort) {
        //   if (queries.sort == "low") {
        //     countSql += "ORDER BY productPrice ASC";
        //   } else if (queries.sort == "high") {
        //     countSql += "ORDER BY productPrice DESC";
        //   } else if (queries.sort == "discount") {
        //     countSql += "ORDER BY discountPercent DESC";
        //   } else if (queries.sort == "rating") {
        //     countSql += "ORDER BY productRating DESC";
        //   }
        // }
        // if (page && limit) {
        //   countSql += ` LIMIT ${limit} OFFSET ${startIndex}`;
        // }

        connection.query(countSql, params, (err, results) => {
          if (err) {
            return connection.rollback((_) => {
              throw err;
            });
          }
          count = results;

          let sql =
            "Select products.id AS _id,  products.* FROM products WHERE 1 = 1 AND productPrice > 0 ";

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
            sql += ` LIMIT ${limit} OFFSET ${startIndex}`;
          }

          connection.query(sql, params, (err, results) => {
            if (err) {
              return connection.rollback((_) => {
                throw err;
              });
            }
            connection.commit((err) => {
              if (err) {
                connection.rollback((_) => {
                  throw err;
                });
              }
              connection.release();
              cb(null, results, count);
            });
          });
        });
      });
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

  searchProducts: (queries, term, cb) => {
    // destructed page and limit for pagination
    const { page, limit } = queries;

    // params that will be passed instead of " ? "
    const params = [];

    let count;

    let pageSql = "";

    // Calculation for getting an OFFSET
    const startIndex = (page - 1) * limit;
    // const endIndex = page * limit;

    pool.getConnection((err, connection) => {
      if (err) {
        throw err;
      }
      connection.beginTransaction((err) => {
        if (err) {
          throw err;
        }
        let countSql =
          "SELECT COUNT(id) AS totalProducts FROM products WHERE 1 = 1 AND productPrice > 0 ";

        if (queries.website) {
          countSql += "AND website = ?";
          params.push(queries.website);
        }
        if (queries.category) {
          countSql += "AND category = ?";
          params.push(queries.category);
        }
        if (queries.gender) {
          countSql += "AND gender = ?";
          params.push(queries.gender);
        }
        if (queries.discountPercent) {
          countSql += "AND discountPercent >= ?";
          params.push(queries.discountPercent.gte);
        }
        if (queries.productPrice && queries.productPrice.gte) {
          countSql += "AND productPrice >= ?";
          params.push(queries.productPrice.gte);
        }
        if (queries.productPrice && queries.productPrice.lte) {
          countSql += "AND productPrice <= ?";
          params.push(queries.productPrice.lte);
        }
        // if (queries.sort) {
        //   if (queries.sort == "low") {
        //     countSql += " ORDER BY productPrice ASC";
        //   } else if (queries.sort == "high") {
        //     countSql += "ORDER BY productPrice DESC";
        //   } else if (queries.sort == "discount") {
        //     countSql += "ORDER BY discountPercent DESC";
        //   } else if (queries.sort == "rating") {
        //     countSql += "ORDER BY productRating DESC";
        //   }
        // }
        // if (page && limit) {
        //   countSql += `LIMIT ${limit} OFFSET ${startIndex}`;
        // }

        connection.query(countSql, params, (err, results) => {
          if (err) {
            return connection.rollback((_) => {
              throw err;
            });
          }
          count = results;

          let filterSql = "";

          let sortSql = "";

          if (queries.website) {
            filterSql += "AND website = ?";
            params.push(queries.website);
          }
          if (queries.category) {
            filterSql += "AND category = ?";
            params.push(queries.category);
          }
          if (queries.gender) {
            filterSql += "AND gender = ?";
            params.push(queries.gender);
          }
          if (queries.discountPercent) {
            filterSql += "AND discountPercent >= ?";
            params.push(queries.discountPercent.gte);
          }
          if (queries.productPrice && queries.productPrice.gte) {
            filterSql += "AND productPrice >= ?";
            params.push(queries.productPrice.gte);
          }
          if (queries.productPrice && queries.productPrice.lte) {
            filterSql += "AND productPrice <= ?";
            params.push(queries.productPrice.lte);
          }
          if (queries.sort) {
            if (queries.sort == "low") {
              sortSql += " ORDER BY productPrice ASC";
            } else if (queries.sort == "high") {
              sortSql += " ORDER BY productPrice DESC";
            } else if (queries.sort == "discount") {
              sortSql += " ORDER BY discountPercent DESC";
            } else if (queries.sort == "rating") {
              sortSql += " ORDER BY productRating DESC";
            }
          }
          if (page && limit) {
            pageSql += ` LIMIT ${limit} OFFSET ${startIndex}`;
          }

          const sql = `Select products.id AS _id,  products.* from products where 1 = 1 AND productPrice > 0 ${filterSql} AND displayCategory like '%${term}%' OR displayCategory like '% ${term}%' ${sortSql} ${pageSql}`;

          connection.query(sql, params, (err, results) => {
            if (err) {
              return connection.rollback((_) => {
                throw err;
              });
            }
            connection.commit((err) => {
              if (err) {
                connection.rollback((_) => {
                  throw err;
                });
              }
              connection.release();
              cb(null, results, count);
            });
          });
        });
      });
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

const pool = require("../db");

module.exports = {
  offerProductsService: (offer, cb) => {
    const sql = "SELECT * FROM earnkaro WHERE offerZone = ?";
    const values = [offer];
    pool.query(sql, values, (err, results) => {
      if (err) {
        cb(err);
      } else {
        cb(null, results);
      }
    });
  },

  singleProductService: (id, cb) => {
    const sql = "SELECT * FROM earnkaro WHERE id = ?";
    const values = [id];
    pool.query(sql, values, (err, results) => {
      if (err) {
        cb(err);
      } else {
        cb(null, results);
      }
    });
  },
};

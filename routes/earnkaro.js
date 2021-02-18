const router = require("express").Router();
const offers = require("../controller/earnkaro");

router.get("/", offers.offerProducts);
router.get("/product", offers.singleProduct);

module.exports = router;

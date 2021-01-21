const router = require("express").Router();
const dataskoreController = require("../controller/dataskore");

router.get("/products", dataskoreController.products);
router.get("/product", dataskoreController.singleProduct);
router.get("/search", dataskoreController.autocomplete);
router.get("/items/search", dataskoreController.searchProducts);
// router.get("/categories", dataskoreController.categories);

module.exports = router;

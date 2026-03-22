const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { search } = require("../controllers/search.controller");

router.use(protect);
router.get("/", search);

module.exports = router;

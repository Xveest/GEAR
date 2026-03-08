const { Router } = require("express");
const { getAll, create } = require("../controllers/evaluacionesController");

const router = Router();

router.get("/", getAll);
router.post("/", create);

module.exports = router;

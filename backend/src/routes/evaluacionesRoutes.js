const { Router } = require("express");
const { getAll, create, getComparativo } = require("../controllers/evaluacionesController");

const router = Router();

router.get("/comparativo", getComparativo);
router.get("/", getAll);
router.post("/", create);

module.exports = router;

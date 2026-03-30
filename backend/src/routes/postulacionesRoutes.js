const { Router } = require("express");
const { getAll, create, update } = require("../controllers/postulacionesController");

const router = Router();

router.get("/", getAll);
router.post("/", create);
router.put("/:id", update);

module.exports = router;

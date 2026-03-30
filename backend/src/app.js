require("dotenv").config();
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");

const authRoutes = require("./routes/authRoutes");
const candidatosRoutes = require("./routes/candidatosRoutes");
const vacantesRoutes = require("./routes/vacantesRoutes");
const postulacionesRoutes = require("./routes/postulacionesRoutes");
const evaluacionesRoutes = require("./routes/evaluacionesRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API GEAR funcionando", version: "1.0.0" });
});

app.use("/api/auth", authRoutes);
app.use("/api/candidatos", candidatosRoutes);
app.use("/api/vacantes", vacantesRoutes);
app.use("/api/postulaciones", postulacionesRoutes);
app.use("/api/evaluaciones", evaluacionesRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor GEAR corriendo en puerto ${PORT}`);
});
const pool = require("../config/db");

const getAll = async () => {
  const result = await pool.query("SELECT * FROM entrevistas ORDER BY fecha DESC");
  return result.rows;
};

const create = async ({ id_postulacion, fecha, tipo, resultado, comentarios }) => {
  const result = await pool.query(
    `INSERT INTO entrevistas (id_postulacion, fecha, tipo, resultado, comentarios)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [id_postulacion, fecha, tipo, resultado, comentarios]
  );
  return result.rows[0];
};

module.exports = { getAll, create };

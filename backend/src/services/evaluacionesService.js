const pool = require("../config/db");

const getAll = async () => {
  const result = await pool.query("SELECT * FROM evaluaciones ORDER BY fecha_evaluacion DESC");
  return result.rows;
};

const create = async ({ id_postulacion, evaluacion_tecnica, evaluacion_psicometrica, evaluacion_rh, comentarios }) => {
  const result = await pool.query(
    `INSERT INTO evaluaciones (id_postulacion, evaluacion_tecnica, evaluacion_psicometrica, evaluacion_rh, comentarios)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [id_postulacion, evaluacion_tecnica, evaluacion_psicometrica, evaluacion_rh, comentarios]
  );
  return result.rows[0];
};

module.exports = { getAll, create };

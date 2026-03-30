const pool = require("../config/db");

const getAll = async () => {
  const result = await pool.query("SELECT * FROM evaluaciones ORDER BY fecha_evaluacion DESC");
  return result.rows;
};

const getComparativo = async (id_vacante) => {
  let query = `
    SELECT 
      e.id_evaluacion, 
      p.id_candidato, 
      c.nombre, 
      c.apellido, 
      c.es_interno, 
      c.nivel_estudios, 
      e.evaluacion_rh as score_liderazgo, 
      e.evaluacion_tecnica as score_tecnico, 
      e.evaluacion_psicometrica as score_idiomas, 
      e.evaluacion_rh as score_fit_cultural,
      CAST(((COALESCE(e.evaluacion_rh, 0) + COALESCE(e.evaluacion_tecnica, 0) + COALESCE(e.evaluacion_psicometrica, 0) + COALESCE(e.evaluacion_rh, 0)) / 4.0) AS FLOAT) as global_score,
      p.id_vacante,
      v.titulo_puesto
    FROM evaluaciones e
    JOIN postulaciones p ON e.id_postulacion = p.id_postulacion
    JOIN candidatos c ON p.id_candidato = c.id_candidato
    JOIN vacantes v ON p.id_vacante = v.id_vacante
  `;
  const params = [];
  if (id_vacante) {
    query += ` WHERE p.id_vacante = $1`;
    params.push(id_vacante);
  }
  query += ` ORDER BY global_score DESC`;
  
  const result = await pool.query(query, params);
  return result.rows;
};

const create = async ({ id_postulacion, evaluacion_rh, evaluacion_tecnica, evaluacion_psicometrica, comentarios }) => {
  const result = await pool.query(
    `INSERT INTO evaluaciones (id_postulacion, evaluacion_rh, evaluacion_tecnica, evaluacion_psicometrica, comentarios)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [id_postulacion, evaluacion_rh, evaluacion_tecnica, evaluacion_psicometrica, comentarios]
  );
  return result.rows[0];
};

module.exports = { getAll, getComparativo, create };

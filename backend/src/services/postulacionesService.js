const pool = require("../config/db");

const getAll = async () => {
  const result = await pool.query(`
    SELECT p.*, c.nombre AS candidato_nombre, c.apellido AS candidato_apellido,
           v.titulo_puesto AS vacante_titulo
    FROM postulaciones p
    JOIN candidatos c ON p.id_candidato = c.id_candidato
    JOIN vacantes v ON p.id_vacante = v.id_vacante
    ORDER BY p.fecha_postulacion DESC
  `);
  return result.rows;
};

const create = async ({ id_candidato, id_vacante, estado_postulacion }) => {
  const result = await pool.query(
    `INSERT INTO postulaciones (id_candidato, id_vacante, estado_postulacion)
     VALUES ($1,$2,$3) RETURNING *`,
    [id_candidato, id_vacante, estado_postulacion || "pendiente"]
  );
  return result.rows[0];
};

const update = async (id, { estado_postulacion }) => {
  const result = await pool.query(
    `UPDATE postulaciones SET estado_postulacion = $1 WHERE id_postulacion = $2 RETURNING *`,
    [estado_postulacion, id]
  );
  
  if (result.rows.length === 0) throw { status: 404, message: "Postulación no encontrada" };

  const postulacion = result.rows[0];

  if (estado_postulacion === 'aceptado') {
      await pool.query(
        `UPDATE vacantes SET estado = 'cerrada' WHERE id_vacante = $1`,
        [postulacion.id_vacante]
      );
  }

  return postulacion;
};

module.exports = { getAll, create, update };

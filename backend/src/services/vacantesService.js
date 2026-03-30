const pool = require("../config/db");

const getAll = async () => {
  const result = await pool.query("SELECT * FROM vacantes ORDER BY fecha_publicacion DESC");
  return result.rows;
};

const getById = async (id) => {
  const result = await pool.query("SELECT * FROM vacantes WHERE id_vacante = $1", [id]);
  if (result.rows.length === 0) throw { status: 404, message: "Vacante no encontrada" };
  return result.rows[0];
};

const create = async ({ titulo_puesto, departamento, descripcion, salario, estado, id_reclutador }) => {
  const result = await pool.query(
    `INSERT INTO vacantes (titulo_puesto, departamento, descripcion, salario, estado, id_reclutador)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [titulo_puesto, departamento, descripcion, salario, estado || "activa", id_reclutador]
  );
  return result.rows[0];
};

const update = async (id, data) => {
  const { titulo_puesto, departamento, descripcion, salario, estado } = data;
  
  // No actualizamos el id_reclutador para no romper la llave y mantener a su creador original.
  const result = await pool.query(
    `UPDATE vacantes SET titulo_puesto=$1, departamento=$2, descripcion=$3, salario=$4,
     estado=$5 WHERE id_vacante=$6 RETURNING *`,
    [titulo_puesto, departamento, descripcion, salario, estado, id]
  );
  if (result.rows.length === 0) throw { status: 404, message: "Vacante no encontrada" };
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query("DELETE FROM vacantes WHERE id_vacante=$1 RETURNING *", [id]);
  if (result.rows.length === 0) throw { status: 404, message: "Vacante no encontrada" };
  return result.rows[0];
};

module.exports = { getAll, getById, create, update, remove };

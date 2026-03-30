const pool = require("../config/db");

const getAll = async () => {
  const result = await pool.query("SELECT * FROM candidatos ORDER BY fecha_registro DESC");
  return result.rows;
};

const getById = async (id) => {
  const result = await pool.query("SELECT * FROM candidatos WHERE id_candidato = $1", [id]);
  if (result.rows.length === 0) throw { status: 404, message: "Candidato no encontrado" };
  return result.rows[0];
};

const create = async ({ nombre, apellido, email, telefono, experiencia_anios, nivel_estudios, cv_url, estado, es_interno }) => {
  const result = await pool.query(
    `INSERT INTO candidatos (nombre, apellido, email, telefono, experiencia_anios, nivel_estudios, cv_url, estado, es_interno)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [nombre, apellido, email, telefono, experiencia_anios, nivel_estudios, cv_url, estado || "activo", es_interno || false]
  );
  return result.rows[0];
};

const update = async (id, data) => {
  const { nombre, apellido, email, telefono, experiencia_anios, nivel_estudios, cv_url, estado, es_interno } = data;
  const result = await pool.query(
    `UPDATE candidatos SET nombre=$1, apellido=$2, email=$3, telefono=$4, experiencia_anios=$5,
     nivel_estudios=$6, cv_url=$7, estado=$8, es_interno=$9 WHERE id_candidato=$10 RETURNING *`,
    [nombre, apellido, email, telefono, experiencia_anios, nivel_estudios, cv_url, estado, es_interno || false, id]
  );
  if (result.rows.length === 0) throw { status: 404, message: "Candidato no encontrado" };
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query("DELETE FROM candidatos WHERE id_candidato=$1 RETURNING *", [id]);
  if (result.rows.length === 0) throw { status: 404, message: "Candidato no encontrado" };
  return result.rows[0];
};

module.exports = { getAll, getById, create, update, remove };

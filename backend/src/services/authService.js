const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async ({ nombre, apellido, email, password, rol }) => {
  const hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO usuarios (nombre, apellido, email, password, rol)
     VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario, nombre, apellido, email, rol`,
    [nombre, apellido, email, hash, rol || "reclutador"]
  );
  return result.rows[0];
};

const login = async ({ email, password }) => {
  const result = await pool.query(
    "SELECT * FROM usuarios WHERE email = $1",
    [email]
  );
  if (result.rows.length === 0) throw { status: 401, message: "Credenciales inválidas" };
  const usuario = result.rows[0];
  const valid = await bcrypt.compare(password, usuario.password);
  if (!valid) throw { status: 401, message: "Credenciales inválidas" };
  const token = jwt.sign(
    { id: usuario.id_usuario, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
  return { token, usuario: { id: usuario.id_usuario, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol } };
};

module.exports = { register, login };

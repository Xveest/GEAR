const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async ({ nombre, apellido, email, password, rol }) => {
  // Determinar el rol basado en el dominio del correo si no se envía explícitamente o validarlo
  let assignedRol = rol;
  
  if (email.endsWith("@admingear.com")) {
    assignedRol = "admin";
  } else if (email.endsWith("@gearrh.com")) {
    assignedRol = email.startsWith("admin") ? "admin" : "recursos_humanos";
  } else if (email.endsWith("@gearreclutador.com") || email.endsWith("@gearreclutador")) {
    assignedRol = "reclutador";
  } else if (!assignedRol) {
    assignedRol = "postulante"; // Cualquier otro correo lo asigno como postulante por defecto
  }

  // Si intentan forzar un rol sin el correo correcto, lo bloqueamos 
  if (assignedRol === "admin" && !email.endsWith("@admingear.com") && !email.endsWith("@gearrh.com")) {
     throw { status: 400, message: "Dominio de correo inválido para el rol de administrador" };
  } else if (assignedRol === "recursos_humanos" && !email.endsWith("@gearrh.com")) {
     throw { status: 400, message: "El correo debe ser @gearrh.com para este rol" };
  } else if (assignedRol === "reclutador") {
    if (!email.endsWith("@gearreclutador.com") && !email.endsWith("@gearreclutador")) throw { status: 400, message: "El correo debe ser @gearreclutador.com para este rol" };
  }

  const hash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO usuarios (nombre, apellido, email, password, rol)
     VALUES ($1, $2, $3, $4, $5) RETURNING id_usuario, nombre, apellido, email, rol`,
    [nombre, apellido, email, hash, assignedRol]
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

const changePassword = async ({ email, oldPassword, newPassword }) => {
  const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
  if (result.rows.length === 0) throw { status: 404, message: "Usuario no encontrado" };
  
  const usuario = result.rows[0];
  const valid = await bcrypt.compare(oldPassword, usuario.password);
  if (!valid) throw { status: 400, message: "La contraseña actual es incorrecta" };
  
  const newHash = await bcrypt.hash(newPassword, 10);
  await pool.query("UPDATE usuarios SET password = $1 WHERE email = $2", [newHash, email]);
  
  return { message: "Contraseña actualizada correctamente" };
};

module.exports = { register, login, changePassword };

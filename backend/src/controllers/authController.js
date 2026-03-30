const authService = require("../services/authService");

const register = async (req, res, next) => {
  try {
    const usuario = await authService.register(req.body);
    res.status(201).json({ success: true, data: usuario });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const result = await authService.changePassword(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, changePassword };

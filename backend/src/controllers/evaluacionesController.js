const evaluacionesService = require("../services/evaluacionesService");

const getAll = async (req, res, next) => {
  try {
    const data = await evaluacionesService.getAll();
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = await evaluacionesService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

module.exports = { getAll, create };

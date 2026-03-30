const evaluacionesService = require("../services/evaluacionesService");

const getAll = async (req, res, next) => {
  try {
    const data = await evaluacionesService.getAll();
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const getComparativo = async (req, res, next) => {
  try {
    const id_vacante = req.query.id_vacante;
    const data = await evaluacionesService.getComparativo(id_vacante);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = await evaluacionesService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

module.exports = { getAll, getComparativo, create };

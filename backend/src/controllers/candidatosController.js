const candidatosService = require("../services/candidatosService");

const getAll = async (req, res, next) => {
  try {
    const data = await candidatosService.getAll();
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const data = await candidatosService.getById(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const data = await candidatosService.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const data = await candidatosService.update(req.params.id, req.body);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const data = await candidatosService.remove(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (err) { next(err); }
};

module.exports = { getAll, getById, create, update, remove };

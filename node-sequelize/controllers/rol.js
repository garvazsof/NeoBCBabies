const Rol = require('../models').Rol;

module.exports = {
  list(req, res) {
    return Rol
      .findAll({
        attributes: ['id', 'description']
      })
      .then((roles) => res.status(200).send(roles))
      .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    return Rol
      .findById(req.params.id, {
        attributes: ['id', 'description']
      })
      .then((rol) => {
        if (!rol) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }
        return res.status(200).send(rol);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    return Rol
      .create({
        id: req.body.id,
        description: req.body.description
      })
      .then((rol) => res.status(201).send(rol))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    return Rol
      .findById(req.params.id, {
      })
      .then(rol => {
        if (!rol) {
          return res.status(404).send({
            message: 'Role Not Found',
          });
        }
        return rol
          .update({
            id: req.body.id || rol.id,
            description: req.body.description || rol.description,
          })
          .then(() => res.status(200).send(rol))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return Rol
      .findById(req.params.id)
      .then(rol => {
        if (!rol) {
          return res.status(400).send({
            message: 'Role Not Found',
          });
        }
        return rol
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
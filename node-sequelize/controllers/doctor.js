const Doctor = require('../models').Doctor;

module.exports = {
  list(req, res) {
    return Doctor
      .findAll({
        attributes: ['id', 'name', 'id_hospital','lastname','secondlastname','profesionalid','bcaddress']
      })
      .then((doctors) => res.status(200).send(doctors))
      .catch((error) => { res.status(400).send(error); });
  },

  getById(req, res) {
    return Doctor
      .findById(req.params.id, {
        attributes: ['id', 'name', 'id_hospital','lastname','secondlastname','profesionalid','bcaddress']
      })
      .then((doctor) => {
        if (!doctor) {
          return res.status(404).send({
            message: 'Doctor Not Found',
          });
        }
        return res.status(200).send(doctor);
      })
      .catch((error) => res.status(400).send(error));
  },

  add(req, res) {
    return Doctor
      .create({
        id: req.body.id,
        Name: req.body.Name
      })
      .then((doctor) => res.status(201).send(doctor))
      .catch((error) => res.status(400).send(error));
  },

  update(req, res) {
    return Doctor
      .findById(req.params.id, {
      })
      .then(doctor => {
        if (!doctor) {
          return res.status(404).send({
            message: 'Doctor Not Found',
          });
        }
        return doctor
          .update({
            id: req.body.id || doctor.id,
            Name: req.body.Name || doctor.Name,
          })
          .then(() => res.status(200).send(doctor))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return Doctor
      .findById(req.params.id)
      .then(doctor => {
        if (!doctor) {
          return res.status(400).send({
            message: 'Doctor Not Found',
          });
        }
        return doctor
          .destroy()
          .then(() => res.status(204).send())
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
var express = require('express');
var router = express.Router();

const rolController = require('../controllers').rol;
const hospitalController = require('../controllers').hospital;
const doctorController = require('../controllers').doctor;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/rol', rolController.list);
router.get('/api/rol/:id', rolController.getById);
router.post('/api/rol', rolController.add);
router.put('/api/rol/:id', rolController.update);
router.delete('/api/rol/:id', rolController.delete);

router.get('/api/hospital', hospitalController.list);
router.get('/api/hospital/:id', hospitalController.getById);
router.post('/api/hospital', hospitalController.add);
router.put('/api/hospital/:id', hospitalController.update);
router.delete('/api/hospital/:id', hospitalController.delete);

router.get('/api/doctor', doctorController.list);
router.get('/api/doctor/:id', doctorController.getById);
router.post('/api/doctor', doctorController.add);
router.put('/api/doctor/:id', doctorController.update);
router.delete('/api/doctor/:id', doctorController.delete);

module.exports = router;

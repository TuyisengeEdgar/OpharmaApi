const express = require('express');
const medicinesController = require('../controllers/medecinesController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, medicinesController.getAllMedicines)
  .post(medicinesController.createMedicines);

router
  .route('/:id')
  .get(medicinesController.getMedicines)
  .patch(
    medicinesController.updateMedecinImage,
    medicinesController.modifyMedicines,
  )
  .delete(medicinesController.deleteMedicines);
module.exports = router;

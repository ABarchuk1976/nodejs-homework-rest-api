const { Router } = require('express');

const router = Router();

const authControllers = require('../controllers/authControllers');
const authMiddlewares = require('../middlewares/authMiddlewares');

router
  .route('/register')
  .post(authMiddlewares.checkSighupUserData, authControllers.addUserController);

router
  .route('/login')
  .post(
    authMiddlewares.checkSighupUserData,
    authControllers.loginUserController
  );

module.exports = router;

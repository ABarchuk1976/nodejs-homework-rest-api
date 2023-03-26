const { Router } = require('express');

const router = Router();

const authControllers = require('../controllers/authControllers');
const authMiddlewares = require('../middlewares/authMiddlewares');

router
  .route('/register')
  .post(
    authMiddlewares.checkAuthUserData,
    authMiddlewares.checkRegisterEmail,
    authControllers.addUserController
  );

router
  .route('/login')
  .post(authMiddlewares.checkAuthUserData, authControllers.loginUserController);

router.use(authMiddlewares.protect);

router.route('/logout').post(authControllers.logoutUserController);

router.route('/current').post(authControllers.currentUserController);

module.exports = router;

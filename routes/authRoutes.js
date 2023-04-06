const { Router } = require('express');

const router = Router();

const authControllers = require('../controllers/authControllers');
const authMiddlewares = require('../middlewares/authMiddlewares');

router
  .route('/register')
  .post(
    authMiddlewares.checkAuthUserData,
    authMiddlewares.checkEmail,
    authControllers.addUserController
  );

router
  .route('verify/:verificationToken')
  .get(
    authMiddlewares.checkVerificationToken,
    authControllers.verificationController
  );

router
  .route('/login')
  .post(authMiddlewares.checkAuthUserData, authControllers.loginUserController);

router.use(authMiddlewares.protect);

router
  .route('/')
  .patch(
    authMiddlewares.checkUserSubscription,
    authControllers.updateSubscriptionController
  );

router.route('/logout').post(authControllers.logoutUserController);

router.route('/current').post(authControllers.currentUserController);

router
  .route('/avatars')
  .patch(authMiddlewares.updateAvatar, authControllers.updateAvatarController);

module.exports = router;

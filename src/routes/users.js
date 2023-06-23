const router = require('express').Router();
const {
  getUsers, getUser, getMyUser, updateUser, updateAvatarUser,
} = require('../controllers/users');

const {
  validationUpdateUser,
  validationUpdateAvatar,
} = require('../middlewares/joiValidation');

router.get('/', getUsers);
router.get('/me', getMyUser);
router.get('/:userId', getUser);
router.patch('/me', validationUpdateUser, updateUser);
router.patch('/me/avatar', validationUpdateAvatar, updateAvatarUser);

module.exports = router;

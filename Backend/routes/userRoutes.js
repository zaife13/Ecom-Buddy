const express = require('express');
const passport = require('passport');
const router = express.Router();

const {
  getAllUsers,
  getUserById,
  getMyAccount,
  updateMe,
  deleteMe,
  updateUser,
  deleteUser,
  createUser,
} = require('../controllers/userController');
const {
  signup,
  login,
  logout,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
  googleAuth,
} = require('../controllers/authController');
const fileUpload = require('../middleware/upload-image');

router.use((req, res, next) => {
  res.header({ 'Access-Control-Allow-Origin': '*' });
  next();
});

// dummt route for testing
router.get('/all', (req, res) => {
  return res.json({ message: 'hello world' });
});

// public routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', protect, logout);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.post('/auth/google', googleAuth);

// only access these routes after logging in because of protect middleware
router.use(protect);
router.get('/me', getMyAccount, getUserById);
router.patch('/updateMe', fileUpload.single('image'), updateMe);
router.patch('/updatePassword', updatePassword);
router.delete('/deleteMe', deleteMe);

// restrict the routes below to admin roles
router.use(restrictTo('admin'));
router.route('/').get(getAllUsers);
router.route('/createUser').post(createUser);
router.route('/:id').get(getUserById).patch(updateUser).delete(deleteUser);

module.exports = router;

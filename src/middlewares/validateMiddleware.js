const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const validateRegister = [
  // Menggunakan express-validator
  require('express-validator').body('name').notEmpty().withMessage('Nama wajib diisi'),
  require('express-validator').body('email').isEmail().withMessage('Format email tidak valid'),
  require('express-validator').body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter'),
  validate
];

module.exports = { validateRegister };
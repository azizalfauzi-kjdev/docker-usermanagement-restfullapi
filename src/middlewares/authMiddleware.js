const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, error: 'Akses ditolak, token tidak ditemukan' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'rahasia_super_securing_jwt_2026');
    req.user = verified; // Menyimpan data user (id, role) di request
    next();
  } catch (err) {
    res.status(403).json({ success: false, error: 'Token tidak valid atau kedaluwarsa' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: 'Akses khusus Admin!' });
  }
  next();
};

module.exports = { verifyToken, verifyAdmin };
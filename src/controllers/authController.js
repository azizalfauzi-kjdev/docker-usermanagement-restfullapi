const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const AuthController = {
  // 1. REGISTER: Pendaftaran Akun Baru
  async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      // Cek apakah email sudah terdaftar
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'Email sudah digunakan' });
      }

      // Hash Password sebelum disimpan ke database
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword, role: role || 'USER' }
      });

      res.status(201).json({
        success: true,
        message: 'Registrasi berhasil',
        data: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
      });
    } catch (err) {
      next(err);
    }
  },

  // 2. LOGIN: Autentikasi dan Mengeluarkan JWT Token
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({ success: false, error: 'Email atau password salah' });
      }

      // Periksa kecocokan password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, error: 'Email atau password salah' });
      }

      // Buat JWT Token yang berlaku selama 1 hari
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'rahasia_super_securing_jwt_2026',
        { expiresIn: '1d' }
      );

      res.json({
        success: true,
        message: 'Login berhasil',
        token
      });
    } catch (err) {
      next(err);
    }
  },

  // 3. READ ALL USERS (Khusus Admin / Protected)
  async getAllUsers(req, res, next) {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true, createdAt: true }
      });
      res.json({ success: true, total: users.length, data: users });
    } catch (err) {
      next(err);
    }
  },

  // 4. DELETE USER
  async deleteUser(req, res, next) {
    try {
      const { id } = parseInt(req.params);
      await prisma.user.delete({ where: { id: Number(req.params.id) } });
      res.json({ success: true, message: 'Pengguna berhasil dihapus' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = AuthController;
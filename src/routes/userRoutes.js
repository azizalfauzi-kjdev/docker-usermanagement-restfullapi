const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/authController");
const { validateRegister } = require("../middlewares/validateMiddleware");
const { verifyToken, verifyAdmin } = require("../middlewares/authMiddleware");

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Daftar akun baru
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 example: ADMIN
 *     responses:
 *       201:
 *         description: Berhasil registrasi
 */
router.post("/register", validateRegister, AuthController.register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login akun dan dapatkan token JWT
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil, mengembalikan token
 */
router.post("/login", AuthController.login);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Mendapatkan semua daftar pengguna (Khusus Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil mendapatkan data
 *       401:
 *         description: Token tidak ada / tidak valid
 *       403:
 *         description: Akses khusus Admin
 */
router.get("/", verifyToken, verifyAdmin, AuthController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Menghapus pengguna berdasarkan ID (Khusus Admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID pengguna yang akan dihapus
 *     responses:
 *       200:
 *         description: Pengguna berhasil dihapus
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Bukan Admin)
 */
router.delete("/:id", verifyToken, verifyAdmin, AuthController.deleteUser);

module.exports = router;

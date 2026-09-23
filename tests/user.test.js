const request = require('supertest');
const app = require('../src/index');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

describe('Skenario Pengujian Otomatis (User Management API)', () => {
  let adminToken = '';
  let userToken = '';
  let targetUserId = null;

  // Membersihkan data tes lama sebelum pengujian dimulai
  beforeAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['testadmin@mail.com', 'testuser@mail.com']
        }
      }
    });
  });

  // Memutuskan koneksi database setelah semua tes selesai
  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('1. POST /users/register - Berhasil mendaftarkan akun ADMIN', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({
        name: 'Test Admin',
        email: 'testadmin@mail.com',
        password: 'password123',
        role: 'ADMIN'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
  });

  test('2. POST /users/register - Berhasil mendaftarkan akun USER biasa', async () => {
    const res = await request(app)
      .post('/users/register')
      .send({
        name: 'Test User',
        email: 'testuser@mail.com',
        password: 'password123',
        role: 'USER'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
  });

  test('3. POST /users/login - Login akun ADMIN dan simpan token', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({
        email: 'testadmin@mail.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    adminToken = res.body.token;
  });

  test('4. POST /users/login - Login akun USER biasa dan simpan token', async () => {
    const res = await request(app)
      .post('/users/login')
      .send({
        email: 'testuser@mail.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    userToken = res.body.token;
  });

  test('5. GET /users - Akses oleh User Biasa (Harus Ditolak / Forbidden 403)', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toEqual(403);
    expect(res.body.success).toBe(false);
  });

  test('6. GET /users - Akses oleh Admin (Harus Berhasil / OK 200)', async () => {
    const res = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);

    // Cari ID user biasa untuk uji coba hapus di tes berikutnya
    const foundUser = res.body.data.find(u => u.email === 'testuser@mail.com');
    if (foundUser) {
      targetUserId = foundUser.id;
    }
  });

  test('7. DELETE /users/:id - Hapus User oleh Admin (Harus Berhasil)', async () => {
    if (targetUserId) {
      const res = await request(app)
        .delete(`/users/${targetUserId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
    }
  });
});
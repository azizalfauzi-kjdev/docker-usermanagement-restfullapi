const express = require("express");
const cors = require("cors"); // <-- 1. Impor pustaka cors
const userRoutes = require("./routes/userRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const errorHandler = require("../src/middlewares/errorHandler");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // <-- 2. Aktifkan middleware CORS di sini
app.use(express.json());

// Konfigurasi Dokumentasi Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Management RESTful API",
      version: "1.0.0",
      description:
        "Dokumentasi API lengkap dengan Auth JWT, Prisma ORM, dan Docker",
    },
    servers: [{ url: `http://localhost:${port}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Pendaftaran Routes
app.use("/users", userRoutes);

// Global Error Handler
app.use(errorHandler);


// Jangan jalankan app.listen jika sedang di Vercel atau Test
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
  });
}

// WAJIB ADA: Ekspor app agar bisa dibaca oleh Jest / Supertest
module.exports = app;

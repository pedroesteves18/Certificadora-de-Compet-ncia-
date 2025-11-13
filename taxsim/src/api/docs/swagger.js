
import swaggerJsdoc from 'swagger-jsdoc'
import dotenv from 'dotenv'
dotenv.config();
const setSwaggerOptions = (url) => ({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Taxsim",
      version: "1.0.0",
    },
    servers: [{ url }],
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
  apis: ["./src/api/docs/*.js", "./src/api/**/*.js"],
})
const specs = swaggerJsdoc(setSwaggerOptions(process.env.BASE_URL));

export { specs };
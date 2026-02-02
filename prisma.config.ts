// Prisma configuration file
// Load environment variables if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not available during build, environment variables should be set by hosting platform
}

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});

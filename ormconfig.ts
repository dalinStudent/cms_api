import { TypeOrmModuleOptions } from "@nestjs/typeorm";

const config: TypeOrmModuleOptions = {
  type: "sqlite",
  database: "./data/database.sqlite",
  entities: ["src/entities/*.entity.ts"],
  synchronize: true,
  logging: true
}

export default config;
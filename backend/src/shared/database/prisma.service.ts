import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      // log: [
      //   { emit: 'event', level: 'query' },
      //   { emit: 'event', level: 'error' },
      //   { emit: 'event', level: 'warn' },
      // ],
      // errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    this.logger.log("Conectando ao PostgreSQL...");
    await this.$connect();
    this.logger.log("Base de dados conectada");
    // @ts-expect-error evento interno Prisma 6
    this.$on("query", (e: any) => {
      this.logger.debug(`Query [${e.duration}ms]: ${e.query}`);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

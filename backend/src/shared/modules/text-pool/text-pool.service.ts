import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from "@nestjs/common";
import { TypingCategory } from "@modules/typing/domain/entities/enums/typing-category";
import { DifficultyLevel } from "@shared/entities/enums/difficulty-level";
import * as fs from "fs";
import * as path from "path";
import { TypingStage } from "@modules/typing/domain/entities/enums/typing-stage";

interface TypingText {
  id: string;
  text: string;
  wordCount: number;
}

@Injectable()
export class TextPoolService implements OnModuleInit {
  private readonly logger = new Logger(TextPoolService.name);
  private readonly pool = new Map<string, TypingText[]>();

  onModuleInit() {
    this.loadAllTexts();
  }

  private loadAllTexts(): void {
    const categories = Object.values(TypingCategory);
    const difficulties = Object.values(DifficultyLevel);

    for (const category of categories) {
      if (category === TypingCategory.BEGINNER) {
        this.loadFile(category, "default");
        continue;
      }

      for (const difficulty of difficulties) {
        this.loadFile(category, difficulty);
      }
    }

    this.loadLearningTexts();
    this.logger.log(`[TextPool] ${this.pool.size} combinacoes carregadas`);
  }

  private loadLearningTexts(): void {
    const stages = Object.values(TypingStage);
    for (const stage of stages) {
      const key = `learning:${stage.toLowerCase()}`;
      const filePath = path.join(
        __dirname,
        "data",
        "learning",
        `${stage.toLowerCase()}.json`,
      );

      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const texts: TypingText[] = JSON.parse(raw);
        this.pool.set(key, texts);
        this.logger.debug(
          `[TextPool] learning carregado: ${key} (${texts.length} textos)`,
        );
      } catch {
        this.logger.warn(
          `[TextPool] learning folder/file nao encontrado: ${filePath}`,
        );
      }
    }
  }

  private loadFile(category: string, difficulty: string): void {
    const key = this.buildKey(category, difficulty);
    const filePath = path.join(
      __dirname,
      "data",
      category.toLowerCase(),
      `${difficulty.toLowerCase()}.json`,
    );

    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const texts: TypingText[] = JSON.parse(raw);
      this.pool.set(key, texts);
      this.logger.debug(
        `[TextPool] carregado: ${key} (${texts.length} textos)`,
      );
    } catch {
      this.logger.warn(`[TextPool] ficheiro nao encontrado: ${filePath}`);
    }
  }

  getRandom(
    category: TypingCategory,
    difficulty: DifficultyLevel,
  ): Omit<TypingText, "id"> {
    const key =
      category === TypingCategory.BEGINNER // TODO: Verificar se é mesmo assim que vai funcionar
        ? this.buildKey(category, "default")
        : this.buildKey(category, difficulty);

    const texts = this.pool.get(key);

    if (!texts?.length) {
      throw new NotFoundException(
        `Nenhum texto disponivel para categoria=${category} dificuldade=${difficulty}`,
      );
    }

    const index = Math.floor(Math.random() * texts.length);
    return texts[index];
  }

  getRandomEvent(category: string, difficulty: string): Omit<TypingText, "id"> {
    const key = this.buildKey(category, difficulty);
    const texts = this.pool.get(key);
    if (!texts || texts.length === 0) {
      throw new NotFoundException(
        `Nenhum texto disponivel para categoria=${category} dificuldade=${difficulty}`,
      );
    }
    const index = Math.floor(Math.random() * texts.length);
    return texts[index];
  }

  getLearningText(stage: TypingStage): Omit<TypingText, "id"> {
    const key = `learning:${stage.toLowerCase()}`;
    const texts = this.pool.get(key);

    if (!texts?.length) {
      throw new NotFoundException(
        `Nenhum texto de aprendizado disponivel para stage=${stage}`,
      );
    }

    const index = Math.floor(Math.random() * texts.length);
    return texts[index];
  }

  private buildKey(category: string, difficulty: string): string {
    return `${category.toLowerCase()}:${difficulty.toLowerCase()}`;
  }
}

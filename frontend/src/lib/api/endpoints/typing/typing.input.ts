import { z } from "zod";
import { createSectionSchema, submitSessionSchema } from "./typing.schema";

export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export type SubmitSessionInput = z.infer<typeof submitSessionSchema>;

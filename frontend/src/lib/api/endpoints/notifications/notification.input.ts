import { z } from "zod";
import { notificationPaginationSchema } from "./notification.schema";

export type NotificationPaginationInput = z.infer<
  typeof notificationPaginationSchema
>;

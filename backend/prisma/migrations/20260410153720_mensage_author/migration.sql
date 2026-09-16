-- AddForeignKey
ALTER TABLE "community_message" ADD CONSTRAINT "community_message_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

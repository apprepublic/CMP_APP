-- AlterTable
ALTER TABLE "Article" ADD COLUMN "isAiGenerated" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Article" ADD COLUMN "sourceUrls" TEXT[];
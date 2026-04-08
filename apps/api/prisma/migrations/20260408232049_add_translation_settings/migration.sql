-- CreateEnum
CREATE TYPE "TranslationStyle" AS ENUM ('KEEP_ALL', 'LOCALIZE');

-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "context_summary" TEXT;

-- AlterTable
ALTER TABLE "Novel" ADD COLUMN     "character_bible" JSONB,
ADD COLUMN     "cultural_setting" TEXT,
ADD COLUMN     "target_language" TEXT NOT NULL DEFAULT 'EN',
ADD COLUMN     "translation_style" "TranslationStyle" NOT NULL DEFAULT 'KEEP_ALL';

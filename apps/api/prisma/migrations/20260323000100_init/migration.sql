-- CreateEnum
CREATE TYPE "Language" AS ENUM ('JP', 'KR', 'CN');

-- CreateEnum
CREATE TYPE "NovelStatus" AS ENUM ('ONGOING', 'COMPLETED', 'HIATUS');

-- CreateEnum
CREATE TYPE "TranslationStatus" AS ENUM ('PENDING', 'PROCESSING', 'DONE', 'FAILED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'RUNNING', 'DONE', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "clerk_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Novel" (
    "id" TEXT NOT NULL,
    "title_original" TEXT NOT NULL,
    "title_english" TEXT,
    "description" TEXT,
    "language" "Language" NOT NULL,
    "status" "NovelStatus" NOT NULL DEFAULT 'ONGOING',
    "cover_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Novel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NovelSource" (
    "id" TEXT NOT NULL,
    "novel_id" TEXT NOT NULL,
    "site_name" TEXT NOT NULL,
    "source_url" TEXT NOT NULL,
    "last_scraped" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NovelSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chapter" (
    "id" TEXT NOT NULL,
    "novel_id" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "chapter_number" INTEGER NOT NULL,
    "title_original" TEXT,
    "title_translated" TEXT,
    "content_raw" TEXT,
    "content_translated" TEXT,
    "raw_content_s3_path" TEXT,
    "translation_status" "TranslationStatus" NOT NULL DEFAULT 'PENDING',
    "translation_cost" DOUBLE PRECISION,
    "published_at" TIMESTAMP(3),
    "scraped_at" TIMESTAMP(3),

    CONSTRAINT "Chapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadingProgress" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "novel_id" TEXT NOT NULL,
    "chapter_id" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadingProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "novel_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GlossaryTerm" (
    "id" TEXT NOT NULL,
    "novel_id" TEXT NOT NULL,
    "term_original" TEXT NOT NULL,
    "term_translated" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "GlossaryTerm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrapeJob" (
    "id" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "scheduled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "error_msg" TEXT,

    CONSTRAINT "ScrapeJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerk_id_key" ON "User"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "NovelSource_source_url_key" ON "NovelSource"("source_url");

-- CreateIndex
CREATE INDEX "Chapter_novel_id_idx" ON "Chapter"("novel_id");

-- CreateIndex
CREATE INDEX "Chapter_source_id_idx" ON "Chapter"("source_id");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_novel_id_chapter_number_key" ON "Chapter"("novel_id", "chapter_number");

-- CreateIndex
CREATE UNIQUE INDEX "ReadingProgress_user_id_novel_id_key" ON "ReadingProgress"("user_id", "novel_id");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_user_id_novel_id_key" ON "Bookmark"("user_id", "novel_id");

-- CreateIndex
CREATE UNIQUE INDEX "GlossaryTerm_novel_id_term_original_key" ON "GlossaryTerm"("novel_id", "term_original");

-- AddForeignKey
ALTER TABLE "NovelSource" ADD CONSTRAINT "NovelSource_novel_id_fkey" FOREIGN KEY ("novel_id") REFERENCES "Novel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_novel_id_fkey" FOREIGN KEY ("novel_id") REFERENCES "Novel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "NovelSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingProgress" ADD CONSTRAINT "ReadingProgress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingProgress" ADD CONSTRAINT "ReadingProgress_novel_id_fkey" FOREIGN KEY ("novel_id") REFERENCES "Novel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadingProgress" ADD CONSTRAINT "ReadingProgress_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_novel_id_fkey" FOREIGN KEY ("novel_id") REFERENCES "Novel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GlossaryTerm" ADD CONSTRAINT "GlossaryTerm_novel_id_fkey" FOREIGN KEY ("novel_id") REFERENCES "Novel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrapeJob" ADD CONSTRAINT "ScrapeJob_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "NovelSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

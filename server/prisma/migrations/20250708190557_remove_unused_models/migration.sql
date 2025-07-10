/*
  Warnings:

  - You are about to drop the `translation_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "translation_logs" DROP CONSTRAINT "translation_logs_userId_fkey";

-- DropTable
DROP TABLE "translation_logs";

-- DropTable
DROP TABLE "users";

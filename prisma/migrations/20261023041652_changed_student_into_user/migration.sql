/*
  Warnings:

  - You are about to drop the column `studentId` on the `Enrollment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,programId]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_studentId_fkey";

-- DropIndex
DROP INDEX "Enrollment_studentId_programId_key";

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "studentId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_userId_programId_key" ON "Enrollment"("userId", "programId");

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

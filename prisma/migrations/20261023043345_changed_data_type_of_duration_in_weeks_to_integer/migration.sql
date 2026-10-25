/*
  Warnings:

  - Changed the type of `durationInWeeks` on the `Program` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "User_phoneNo_key";

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "durationInWeeks",
ADD COLUMN     "durationInWeeks" INTEGER NOT NULL;

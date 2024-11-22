/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `StudyPlans` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,name]` on the table `Subjects` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[subjectId,name]` on the table `Topics` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "StudyPlans_name_key";

-- DropIndex
DROP INDEX "Subjects_name_key";

-- DropIndex
DROP INDEX "Topics_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "StudyPlans_userId_name_key" ON "StudyPlans"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Subjects_userId_name_key" ON "Subjects"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Topics_subjectId_name_key" ON "Topics"("subjectId", "name");

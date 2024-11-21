/*
  Warnings:

  - The `priority_level` column on the `PlanSubjects` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PriorityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "PlanSubjects" DROP COLUMN "priority_level",
ADD COLUMN     "priority_level" "PriorityLevel" NOT NULL DEFAULT 'LOW';

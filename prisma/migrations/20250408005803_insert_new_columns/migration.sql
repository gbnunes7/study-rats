-- CreateEnum
CREATE TYPE "Subject" AS ENUM ('JAVASCRIPT', 'PYTHON', 'JAVA', 'C_SHARP', 'RUBY', 'PHP', 'GO', 'HTML', 'CSS', 'PROGRAMMING_LOGIC', 'DATA_STRUCTURES', 'ALGORITHMS');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "description" TEXT,
ADD COLUMN     "subject_interests" "Subject"[];

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'VOLUNTEER', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "profilePic" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "password" TEXT NOT NULL,
    "tokens" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "fcmTokens" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isBanedUser" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParentStory" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "currentPart" INTEGER NOT NULL,
    "nextPart" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "ParentStory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Part" (
    "id" SERIAL NOT NULL,
    "parentStoryId" INTEGER NOT NULL,
    "partNo" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Part_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Part_partNo_parentStoryId_idx" ON "Part"("partNo", "parentStoryId");

-- AddForeignKey
ALTER TABLE "Part" ADD CONSTRAINT "Part_parentStoryId_fkey" FOREIGN KEY ("parentStoryId") REFERENCES "ParentStory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Part" ADD CONSTRAINT "Part_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

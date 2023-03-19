-- CreateEnum
CREATE TYPE "SocialAccountType" AS ENUM ('FACEBOOK', 'DISCORD', 'GOOGLE');

-- CreateTable
CREATE TABLE "SocialAccount" (
    "id" SERIAL NOT NULL,
    "accessToken" TEXT NOT NULL,
    "socialId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "socialType" "SocialAccountType" NOT NULL DEFAULT 'FACEBOOK',

    CONSTRAINT "SocialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SocialAccount_socialId_socialType_idx" ON "SocialAccount"("socialId", "socialType");

-- AddForeignKey
ALTER TABLE "SocialAccount" ADD CONSTRAINT "SocialAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

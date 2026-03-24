-- CreateEnum
CREATE TYPE "RequestSource" AS ENUM ('WIDGET', 'TESTFLIGHT', 'API');

-- CreateEnum
CREATE TYPE "TestFlightFeedbackType" AS ENUM ('SCREENSHOT', 'CRASH');

-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_conversationId_fkey";

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "source" "RequestSource" NOT NULL DEFAULT 'WIDGET',
ALTER COLUMN "conversationId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "TestFlightConfig" (
    "id" TEXT NOT NULL,
    "issuerId" TEXT NOT NULL,
    "keyId" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "webhookSecret" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TestFlightConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestFlightFeedback" (
    "id" TEXT NOT NULL,
    "configId" TEXT NOT NULL,
    "appleFeedbackId" TEXT NOT NULL,
    "feedbackType" "TestFlightFeedbackType" NOT NULL,
    "testerEmail" TEXT,
    "testerName" TEXT,
    "deviceModel" TEXT,
    "osVersion" TEXT,
    "appVersion" TEXT,
    "buildVersion" TEXT,
    "comment" TEXT,
    "screenshotUrl" TEXT,
    "crashLog" TEXT,
    "metadata" JSONB,
    "submittedAt" TIMESTAMP(3),
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requestId" TEXT,

    CONSTRAINT "TestFlightFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutoApproveRule" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutoApproveRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TestFlightFeedback_appleFeedbackId_key" ON "TestFlightFeedback"("appleFeedbackId");

-- CreateIndex
CREATE UNIQUE INDEX "TestFlightFeedback_requestId_key" ON "TestFlightFeedback"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "AutoApproveRule_email_key" ON "AutoApproveRule"("email");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestFlightFeedback" ADD CONSTRAINT "TestFlightFeedback_configId_fkey" FOREIGN KEY ("configId") REFERENCES "TestFlightConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestFlightFeedback" ADD CONSTRAINT "TestFlightFeedback_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "Request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

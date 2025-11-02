-- CreateTable
CREATE TABLE "public"."UserNotificationSettings" (
    "userId" TEXT NOT NULL,
    "newJobEmailNotifications" BOOLEAN NOT NULL DEFAULT false,
    "aiPrompt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserNotificationSettings_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "public"."UserNotificationSettings" ADD CONSTRAINT "UserNotificationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

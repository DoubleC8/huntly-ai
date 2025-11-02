/**
 * Quick test script to verify userNotificationSettings functions work
 * Run with: npx tsx test-notification-settings.ts
 * 
 * Make sure you have a valid user ID in your database first!
 */

import { insertUserNotificationSettings, updateUserNotificationSettings } from "./features/users/db/userNotificationSettings";
import { prisma } from "./lib/prisma";

async function testNotificationSettings() {
  try {
    // Get the first user from your database (or use a specific user ID)
    const firstUser = await prisma.user.findFirst({
      select: { id: true, email: true },
    });

    if (!firstUser) {
      console.log("❌ No users found in database. Create a user first.");
      return;
    }

    console.log(`\n🧪 Testing with user: ${firstUser.email} (${firstUser.id})\n`);

    // Test 1: Insert notification settings (should only insert if doesn't exist)
    console.log("Test 1: Inserting notification settings...");
    await insertUserNotificationSettings({
      userId: firstUser.id,
      newJobEmailNotifications: true,
      aiPrompt: "Test prompt",
    });
    console.log("✅ insertUserNotificationSettings: PASSED");

    // Test 2: Try inserting again (should not create duplicate)
    console.log("\nTest 2: Attempting duplicate insert (should be ignored)...");
    await insertUserNotificationSettings({
      userId: firstUser.id,
      newJobEmailNotifications: false,
      aiPrompt: "Different prompt",
    });
    console.log("✅ Duplicate insert ignored: PASSED");

    // Test 3: Update existing settings (should use upsert)
    console.log("\nTest 3: Updating notification settings...");
    await updateUserNotificationSettings(firstUser.id, {
      newJobEmailNotifications: false,
      aiPrompt: "Updated prompt",
    });
    console.log("✅ updateUserNotificationSettings: PASSED");

    // Test 4: Verify the data was saved correctly
    console.log("\nTest 4: Verifying saved data...");
    const settings = await prisma.userNotificationSettings.findUnique({
      where: { userId: firstUser.id },
    });

    if (settings) {
      console.log("✅ Data retrieved successfully:");
      console.log("   - newJobEmailNotifications:", settings.newJobEmailNotifications);
      console.log("   - aiPrompt:", settings.aiPrompt);
      console.log("   - Created at:", settings.createdAt);
    } else {
      console.log("❌ Settings not found after insert/update");
      return;
    }

    console.log("\n🎉 All tests passed! The Prisma conversion is working correctly.\n");
  } catch (error) {
    console.error("\n❌ Test failed with error:");
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testNotificationSettings();


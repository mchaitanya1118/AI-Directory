// Script to validate DATABASE_URL and print friendly instructions if it contains errors.
const urlStr = process.env.DATABASE_URL;

if (!urlStr) {
  console.error("\x1b[31m[AuraAI Validation Error] DATABASE_URL environment variable is missing or empty!\x1b[0m");
  console.error("Please configure the DATABASE_URL environment variable in your deployment platform (e.g. Coolify/Supabase).");
  process.exit(1);
}

try {
  // Check for common placeholders or unreplaced brackets
  if (urlStr.includes("[YOUR-PASSWORD]") || urlStr.includes("YOUR-PASSWORD")) {
    console.error("\x1b[31m[AuraAI Validation Error] DATABASE_URL contains the placeholder '[YOUR-PASSWORD]'.\x1b[0m");
    console.error("Please replace '[YOUR-PASSWORD]' with your actual database password in your deployment environment variables.");
    process.exit(1);
  }

  if (urlStr.includes("[") || urlStr.includes("]")) {
    // Check if it's an IPv6 address, otherwise it's probably unreplaced brackets in a password
    const hasIPv6 = /\[[0-9a-fA-F:]+\]/.test(urlStr);
    if (!hasIPv6) {
      console.error("\x1b[31m[AuraAI Validation Error] DATABASE_URL contains square brackets '[' or ']'.\x1b[0m");
      console.error("If you kept the brackets around your password (e.g., [mypassword] instead of mypassword), please remove them.");
      console.error("If your password contains special characters, they must be URL-encoded (e.g., '@' becomes '%40', ':' becomes '%3A').");
      process.exit(1);
    }
  }

  // Parse the URL to check for other issues
  const parsed = new URL(urlStr);
  if (!parsed.username || !parsed.password) {
    console.error("\x1b[33m[AuraAI Validation Warning] DATABASE_URL is missing a username or password.\x1b[0m");
  }
} catch (e) {
  console.error("\x1b[31m[AuraAI Validation Error] DATABASE_URL is not a valid connection URL format.\x1b[0m");
  console.error("Details:", e.message);
  console.error("Expected format: postgresql://username:password@hostname:port/database");
  console.error("Note: If your password contains special characters (like '@', ':', '/', etc.), they MUST be URL-encoded.");
  console.exit ? console.exit(1) : process.exit(1);
}

console.log("\x1b[32m[AuraAI Validation] DATABASE_URL format is valid!\x1b[0m");

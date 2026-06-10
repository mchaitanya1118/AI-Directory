const { execSync } = require('child_process');

console.log('[AuraAI Startup] Initializing container startup...');

// 1. Correct DATABASE_URL if it contains unescaped '#' in the password
let dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
  const match = dbUrl.match(/^(postgres(?:ql)?:\/\/)([^:]+):([^@]+)(@.+)$/);
  if (match) {
    const [_, proto, user, pass, rest] = match;
    if (pass.includes('#')) {
      console.log('[AuraAI Startup] Detected unescaped "#" in database password. Encoding to "%23"...');
      const encodedPass = pass.replace(/#/g, '%23');
      process.env.DATABASE_URL = `${proto}${user}:${encodedPass}${rest}`;
    }
  }
}

// 2. Run Validation Script
try {
  console.log('[AuraAI Startup] Validating database URL...');
  execSync('node scripts/validate-db-url.js', { stdio: 'inherit' });
} catch (error) {
  console.error('[AuraAI Startup] Database URL validation failed!');
  process.exit(1);
}

// 3. Run Prisma DB Push
try {
  console.log('[AuraAI Startup] Syncing database schema (npx prisma db push)...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit' });
  console.log('[AuraAI Startup] Database schema synced successfully.');
} catch (error) {
  console.error('[AuraAI Startup] Database schema sync failed! Please check database connectivity and credentials.');
  process.exit(1);
}

// 4. Start Next.js Production Server
try {
  console.log('[AuraAI Startup] Launching Next.js production server...');
  execSync('npm run start', { stdio: 'inherit' });
} catch (error) {
  console.error('[AuraAI Startup] Next.js server crashed on startup!');
  process.exit(1);
}

/**
 * Creates the values for the admin login environment variables.
 *
 *   npm run admin:password
 *
 * Prompts for a password (not echoed) and prints ADMIN_PASSWORD_HASH, plus a
 * fresh random SESSION_SECRET and CRON_SECRET. Paste them into Vercel:
 * Settings, then Environment Variables.
 */
import crypto from "node:crypto";
import readline from "node:readline";

function ask(prompt) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.includes(prompt)) process.stdout.write(s); };
    rl.question(prompt, (answer) => { rl.close(); process.stdout.write("\n"); resolve(answer); });
  });
}

const password = process.env.ADMIN_PASSWORD || (await ask("New admin password (min 12 characters): "));
if (password.length < 12) {
  console.error("Use at least 12 characters.");
  process.exit(1);
}
const N = 16384, r = 8, p = 1;
const salt = crypto.randomBytes(16);
const hash = crypto.scryptSync(password, salt, 32, { N, r, p });
console.log("\nAdd these in Vercel (Settings, Environment Variables, Production):\n");
console.log(`ADMIN_PASSWORD_HASH=scrypt:${N}:${r}:${p}:${salt.toString("base64")}:${hash.toString("base64")}`);
console.log(`SESSION_SECRET=${crypto.randomBytes(32).toString("base64url")}`);
console.log(`CRON_SECRET=${crypto.randomBytes(24).toString("base64url")}`);
console.log("\nAlso set ADMIN_EMAIL to the address you'll sign in with.");

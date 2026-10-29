/**
 * Creates the values for the admin login environment variables.
 *
 *   npm run admin:password           new password, typed twice
 *   npm run admin:password -- check  test a password against a saved hash
 *
 * Prompts for a password (not echoed) and prints ADMIN_PASSWORD_HASH, plus a
 * fresh random SESSION_SECRET and CRON_SECRET. Paste them into Vercel:
 * Settings, then Environment Variables.
 */
import crypto from "node:crypto";
import readline from "node:readline";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: process.stdin.isTTY });
let muted = false;
const write = rl._writeToOutput.bind(rl);
rl._writeToOutput = (s) => { if (!muted || s.includes("\n") || s.includes("\r")) write(muted ? "" : s); };
const lines = [];
let waiting = null;
rl.on("line", (l) => (waiting ? (waiting(l), (waiting = null)) : lines.push(l)));

function ask(prompt, { hidden = true } = {}) {
  process.stdout.write(prompt);
  muted = hidden;
  return new Promise((resolve) => {
    const done = (answer) => { muted = false; if (hidden) process.stdout.write("\n"); resolve(answer); };
    lines.length ? done(lines.shift()) : (waiting = done);
  });
}

function verify(password, stored) {
  const parts = stored.replace(/\s+/g, "").replace(/^ADMIN_PASSWORD_HASH=/, "").replace(/^["']+|["']+$/g, "").split(/[:$]/);
  if (parts.length !== 6 || parts[0] !== "scrypt") return null;
  const [, N, r, p, salt, hash] = parts;
  const expected = Buffer.from(hash, "base64");
  const actual = crypto.scryptSync(password, Buffer.from(salt, "base64"), expected.length, { N: +N, r: +r, p: +p, maxmem: 256 * 1024 * 1024 });
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

if (process.argv[2] === "check") {
  const stored = await ask("Paste the ADMIN_PASSWORD_HASH value from Vercel: ", { hidden: false });
  const password = await ask("Type the password you sign in with: ");
  const ok = verify(password, stored);
  if (ok === null) console.log("\nThat hash isn't in the right format. It should be one line starting with scrypt:");
  else console.log(ok ? "\nMatch. This password is correct for that hash, so check ADMIN_EMAIL next." : "\nNo match. That password doesn't fit this hash. Run npm run admin:password to make a new one.");
  rl.close();
  process.exit(0);
}

let password = process.env.ADMIN_PASSWORD;
if (!password) {
  password = await ask("New admin password (min 12 characters): ");
  if (password.length >= 12 && (await ask("Type it again to confirm: ")) !== password) {
    rl.close();
    console.error("\nThe two passwords didn't match. Nothing was created. Run the command again.");
    process.exit(1);
  }
}
rl.close();
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
console.log("If you're only resetting the password, change ADMIN_PASSWORD_HASH and keep your existing SESSION_SECRET and CRON_SECRET.");

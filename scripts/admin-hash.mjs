// Usage: npm run admin:hash [-- username]
// Type the password when asked (it isn't shown and doesn't go into shell history).
// Prints the value for ADMIN_USERS, e.g. arbri:scrypt.16384.8.1.…
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline";

const user = process.argv[2] ?? "arbri";
const rl = createInterface({ input: process.stdin, output: process.stderr, terminal: process.stdin.isTTY });
let muted = false;
rl._writeToOutput = (s) => {
  if (!muted) process.stderr.write(s);
};
rl.question("Fjalëkalimi (min. 12 karaktere): ", (password) => {
  rl.close();
  process.stderr.write("\n");
  if (password.length < 12) {
    console.error("Fjalëkalimi duhet të ketë të paktën 12 karaktere.");
    process.exit(1);
  }
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 32, { N: 16384, r: 8, p: 1 });
  console.log(`${user}:${["scrypt", "16384", "8", "1", salt.toString("base64url"), hash.toString("base64url")].join(".")}`);
});
muted = true;

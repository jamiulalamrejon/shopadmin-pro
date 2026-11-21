// Developed by www.Jamiulalamrejon.com (https://www.Jamiulalamrejon.com)
// Usage: npm run hash-password -- "MyNewPassword@123"
// Paste the printed hash into lib/demo-data.ts (staff passwordHash).
import bcrypt from "bcryptjs";

const pwd = process.argv[2];
if (!pwd || pwd.length < 8) {
  console.error("Give a password with at least 8 characters.");
  process.exit(1);
}
console.log(bcrypt.hashSync(pwd, 12));

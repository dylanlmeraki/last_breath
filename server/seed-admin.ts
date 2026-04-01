import { hash } from "@node-rs/argon2";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import * as schema from "../shared/schema";

const ARGON2_OPTIONS = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

function parseArgs(): { email: string; name: string; password: string } {
  const args = process.argv.slice(2);
  let email = "";
  let name = "";
  let password = "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--email" && args[i + 1]) {
      email = args[++i];
    } else if (args[i] === "--name" && args[i + 1]) {
      name = args[++i];
    } else if (args[i] === "--password" && args[i + 1]) {
      password = args[++i];
    }
  }

  if (!email || !name || !password) {
    console.error("Usage: npm run seed:admin -- --email <email> --name <full_name> --password <password>");
    console.error("Example: npm run seed:admin -- --email admin@pacificengineeringsf.com --name \"John Doe\" --password \"SecurePass123!\"");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("Error: Password must be at least 8 characters.");
    process.exit(1);
  }

  return { email, name, password };
}

async function main() {
  const { email, name, password } = parseArgs();

  if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL environment variable is required.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  try {
    const existing = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, email.toLowerCase()))
      .limit(1);

    if (existing.length > 0) {
      console.error(`Error: A user with email "${email}" already exists.`);
      process.exit(1);
    }

    const hashedPassword = await hash(password, ARGON2_OPTIONS);

    const [user] = await db
      .insert(schema.users)
      .values({
        full_name: name,
        email: email.toLowerCase(),
        hashed_password: hashedPassword,
        role: "admin",
        account_type: "internal",
        status: "active",
        email_verified: true,
        created_by: "seed-script",
      })
      .returning({ id: schema.users.id, email: schema.users.email });

    console.log(`\nAdmin account created successfully!`);
    console.log(`  ID:    ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Name:  ${name}`);
    console.log(`  Role:  admin`);
    console.log(`\nYou can now log in at /internal/auth`);
  } catch (error: any) {
    console.error("Failed to create admin account:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();

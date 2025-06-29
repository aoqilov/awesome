import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Get directory name
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Manually load environment variables from .env file
function loadEnvVars() {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf8");
      const envVars = envContent.split("\n").reduce((acc, line) => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || "";
          // Remove quotes if they exist
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, -1);
          }
          acc[key] = value;
        }
        return acc;
      }, {});

      // Set environment variables
      Object.entries(envVars).forEach(([key, value]) => {
        process.env[key] = value;
      });
    }
  } catch (error) {
    console.warn("Warning: Could not load .env file", error);
  }
}

// Load environment variables
loadEnvVars();

// Get environment variables with defaults
const outputPath = process.env.OUTPUT_PATH || "../app/types";
const pocketbaseUrl = process.env.POCKETBASE_URL;
const pocketbaseEmail = process.env.POCKETBASE_EMAIL;
const pocketbasePassword = process.env.POCKETBASE_PASSWORD;

// Validate required environment variables
if (!pocketbaseUrl || !pocketbaseEmail || !pocketbasePassword) {
  console.error(
    "Error: Missing required environment variables. Please check your .env file."
  );
  console.error(
    "Required variables: POCKETBASE_URL, POCKETBASE_EMAIL, POCKETBASE_PASSWORD"
  );
  process.exit(1);
}

// Execute commands
try {
  execSync(`rimraf ${outputPath}`, { stdio: "inherit" });

  execSync(
    `npx pocketbase-typegen --url ${pocketbaseUrl} --email ${pocketbaseEmail} --password ${pocketbasePassword} --out ${outputPath}`,
    { stdio: "inherit" }
  );
} catch (error) {
  console.error("Error generating types:", error);
  process.exit(1);
}

import { INITIAL_TOOLS } from "../src/data/data.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  const toolsJsonPath = path.join(__dirname, "../src/data/tools.json");
  fs.writeFileSync(toolsJsonPath, JSON.stringify(INITIAL_TOOLS, null, 2), "utf8");
  console.log("SUCCESS: Tools serialized to " + toolsJsonPath);
} catch (e) {
  console.error("ERROR: Failed serialization conversion: ", e);
}

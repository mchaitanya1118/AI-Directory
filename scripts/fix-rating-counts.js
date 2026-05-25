const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../src/data/tools.json');
const toolsData = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

console.log("Scaling ratingCount fields in tools.json...");

for (const t of toolsData) {
  const original = t.ratingCount || 0;
  let scaled = original;
  
  if (original > 1000) {
    scaled = Math.round(original / 50) + 12;
  } else if (original > 0) {
    scaled = Math.round(original / 10) + 12;
  }
  
  t.ratingCount = scaled;
  console.log(`- ${t.name}: ${original} -> ${scaled}`);
}

fs.writeFileSync(toolsPath, JSON.stringify(toolsData, null, 2), 'utf8');
console.log("Successfully updated tools.json!");

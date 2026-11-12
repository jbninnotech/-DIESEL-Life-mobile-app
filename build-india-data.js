const fs = require("fs");

// India Post "All India Pincode Directory" (GODL licence), GitHub copy
const URL =
  "https://raw.githubusercontent.com/dropdevrahul/pincodes-india/main/pincode.csv";

function parseLine(line) {
  const out = [];
  let cur = "", q = false;
  for (const ch of line) {
    if (ch === '"') q = !q;
    else if (ch === "," && !q) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}

const titleCase = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/(^|[\s(-])\w/g, (m) => m.toUpperCase());

(async () => {
  const text = await (await fetch(URL)).text();
  const lines = text.split(/\r?\n/).filter(Boolean);
  const header = parseLine(lines[0]).map((h) => h.trim().toLowerCase());

  const iName = header.indexOf("officename");
  const iPin = header.indexOf("pincode");
  const iDist = header.indexOf("district");
  const iState = header.indexOf("statename");

  if ([iName, iPin, iDist, iState].some((i) => i < 0)) {
    console.error("Unexpected columns:", header);
    process.exit(1);
  }

  const data = {};
  const seen = new Set();

  for (const line of lines.slice(1)) {
    const c = parseLine(line);
    const pincode = (c[iPin] || "").trim();
    if (!/^\d{6}$/.test(pincode)) continue;

    const city = titleCase(
      (c[iName] || "").replace(/\s+(B\.O|S\.O|H\.O|G\.P\.O)\.?$/i, "")
    );
    const state = titleCase(c[iState] || "");
    const district = titleCase(c[iDist] || "");
    if (!city || !state || !district) continue;

    const key = `${state}|${district}|${city}|${pincode}`;
    if (seen.has(key)) continue;
    seen.add(key);

    ((data[state] ??= {})[district] ??= []).push({ city, pincode });
  }

  // sort states, districts and cities alphabetically
  const sorted = {};
  for (const s of Object.keys(data).sort()) {
    sorted[s] = {};
    for (const d of Object.keys(data[s]).sort()) {
      sorted[s][d] = data[s][d].sort((a, b) => a.city.localeCompare(b.city));
    }
  }

  fs.mkdirSync("src/assets", { recursive: true });
  fs.writeFileSync("src/assets/indiaData.json", JSON.stringify(sorted));
  console.log("Done. Offices:", seen.size);
})();
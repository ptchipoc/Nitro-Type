const fs = require('fs');

const pt = JSON.parse(fs.readFileSync('frontend/src/lib/messages/pt.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('frontend/src/lib/messages/en.json', 'utf8'));
const fr = JSON.parse(fs.readFileSync('frontend/src/lib/messages/fr.json', 'utf8'));

function getKeys(obj, prefix = '') {
  let keys = [];
  for (let key in obj) {
    let p = prefix ? prefix + '.' + key : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getKeys(obj[key], p));
    } else {
      keys.push(p);
    }
  }
  return keys;
}

const ptKeys = new Set(getKeys(pt));
const enKeys = new Set(getKeys(en));
const frKeys = new Set(getKeys(fr));

console.log("Keys in EN but not in PT:");
for (let k of enKeys) if (!ptKeys.has(k)) console.log("Missing in PT: " + k);

console.log("Keys in EN but not in FR:");
for (let k of enKeys) if (!frKeys.has(k)) console.log("Missing in FR: " + k);

console.log("Keys in PT but not in EN:");
for (let k of ptKeys) if (!enKeys.has(k)) console.log("Missing in EN: " + k);

console.log("Keys in PT but not in FR:");
for (let k of ptKeys) if (!frKeys.has(k)) console.log("Missing in FR: " + k);

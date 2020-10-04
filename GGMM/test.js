const GiffyMonster = require("./GiffyImporter");

const monster = JSON.stringify(require("./monster.json"));
const m = new GiffyMonster(monster);

const log = (m, prop) => console.log(`${prop.toUpperCase()}: `, m[prop]);

log(m, "name");
log(m, "size");
log(m, "type");
log(m, "alignment");
log(m, "level");
log(m, "role");
log(m, "rank");
log(m, "image");
log(m, "dcs");
log(m, "ac");
log(m, "acType");
log(m, "hp");
log(m, "hpFormula");
log(m, "speed");
log(m, "abilityScores");
log(m, "savingThrows");
log(m, "proficiencyBonus");
log(m, "xp");
log(m, "skills");
log(m, "initiative");
log(m, "damageVulnerabilities");
log(m, "damageResistances");
log(m, "damageImmunities");
log(m, "conditionImmunities");
log(m, "senses");
log(m, "languages");
log(m, "challengeRating");
log(m, "traits");
log(m, "actions");
log(m, "reactions");
log(m, "legendaryActionsPerRound");
log(m, "legendaryActions");
log(m, "lairActionsInitiative");
log(m, "lairActions");
log(m, "note");

// console.log('Name: ', m.name);
// console.log('Size: ', m.size);
// console.log('Type: ', m.type);
// console.log('Alignment: ', m.alignment);
// console.log('Level: ', m.level);
// console.log(m.abilityScores);

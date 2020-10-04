// The following code was used to extract the data from this page
// https://giffyglyph.com/monstermaker/rules/making_monsters.html#monster_roles

/* function getRoles() {
  const t = document.getElementById('table-monster-roles')
  const rows = Array.from(t.rows).slice(1)
  const roles = {}
  
  const num = (d) => d === "—" ? 0 : d.startsWith("−") ? (-1 * parseInt(d.slice(1))) : parseInt(d)
  const arr = (d) => d.split(', ').map(num)
  const mult = (d) => d === "—" ? 1 : parseFloat(d.replace('x ', ''))
  const skill = (d) => d === "—" ? false : true
  
  for (const row of rows) {
    let [role, ...data] = Array.from(row.cells).map(cell => cell.innerText)
    console.log(role, data)
    
    roles[role.toLowerCase()] = {
      ac: num(data[0]),
      savingThrows: num(data[1]),
      hp: mult(data[2]),
      attack: num(data[3]),
      damage: mult(data[4]),
      speed: num(data[5]),
      perception: skill(data[6]),
      stealth: skill(data[7]),
      initiative: skill(data[8])
    }
  }
  
  return roles;
}

getRoles() */

const roles = {
  controller: {
    ac: -2,
    savingThrows: -1,
    hp: 1,
    attack: 0,
    damage: 1,
    speed: 0,
    perception: false,
    stealth: false,
    initiative: true,
  },
  defender: {
    ac: 2,
    savingThrows: 1,
    hp: 1,
    attack: 0,
    damage: 1,
    speed: -10,
    perception: true,
    stealth: false,
    initiative: false,
  },
  lurker: {
    ac: -4,
    savingThrows: -2,
    hp: 0.5,
    attack: 2,
    damage: 1.5,
    speed: 0,
    perception: true,
    stealth: true,
    initiative: false,
  },
  scout: {
    ac: -2,
    savingThrows: -1,
    hp: 1,
    attack: 0,
    damage: 0.75,
    speed: 10,
    perception: true,
    stealth: true,
    initiative: true,
  },
  sniper: {
    ac: 0,
    savingThrows: 0,
    hp: 0.75,
    attack: 0,
    damage: 1.25,
    speed: 0,
    perception: false,
    stealth: true,
    initiative: false,
  },
  striker: {
    ac: -4,
    savingThrows: -2,
    hp: 1.25,
    attack: 2,
    damage: 1.25,
    speed: 0,
    perception: false,
    stealth: false,
    initiative: false,
  },
  supporter: {
    ac: -2,
    savingThrows: -1,
    hp: 0.75,
    attack: 0,
    damage: 0.75,
    speed: 0,
    perception: false,
    stealth: false,
    initiative: true,
  },
};

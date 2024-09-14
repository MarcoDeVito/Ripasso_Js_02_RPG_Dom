let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["bastone"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const weapons = [
  { name: 'bastone', power: 5 },
  { name: 'pugnale', power: 30 },
  { name: 'martello', power: 50 },
  { name: 'spada', power: 100 }
];
const monsters = [
  {
    name: "melma",
    level: 2,
    health: 15
  },
  {
    name: "bestia zannuta",
    level: 8,
    health: 60
  },
  {
    name: "drago",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "piazza della città",
    "button text": ["Vai al negozio", "Vai alla caverna", "Combatti il drago"],
    "button functions": [goStore, goCave, fightDragon],
    text: 'Sei nella piazza della città. Vedi un cartello che dice "Negozio".'
  },
  {
    name: "negozio",
    "button text": ["Compra 10 salute (10 oro)", "Compra arma (30 oro)", "Vai alla piazza della città"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Entri nel negozio."
  },
  {
    name: "caverna",
    "button text": ["Combatti melma", "Combatti bestia zannuta", "Vai alla piazza della città"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "Entri nella caverna. Vedi alcuni mostri."
  },
  {
    name: "combattimento",
    "button text": ["Attacca", "Schiva", "Fuggi"],
    "button functions": [attack, dodge, goTown],
    text: "Stai combattendo un mostro."
  },
  {
    name: "uccidi il mostro",
    "button text": ["Rimani nella caverna", "Vai alla piazza della città", "Vai alla piazza della città"],
    "button functions": [goCave, goTown, easterEgg],
    text: 'Il mostro urla "Arg!" mentre muore. Guadagni punti esperienza e trovi oro.'
  },
  {
    name: "perdi",
    "button text": ["RIGIOCA?", "RIGIOCA?", "RIGIOCA?"],
    "button functions": [restart, restart, restart],
    text: "Sei morto. &#x2620;"
  },
  { 
    name: "vittoria", 
    "button text": ["RIGIOCA?", "RIGIOCA?", "RIGIOCA?"], 
    "button functions": [restart, restart, restart], 
    text: "Hai sconfitto il drago! HAI VINTO IL GIOCO! &#x1F389;" 
  },
  {
    name: "uovo di pasqua",
    "button text": ["2", "8", "Vai alla piazza della città?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "Hai trovato un EasterEgg! Scegli un numero sopra. Verranno scelti casualmente dieci numeri tra 0 e 10. Se il numero che scegli corrisponde a uno dei numeri casuali, vinci!"
  }
];

// inizializza i pulsanti
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "Non hai abbastanza oro per comprare salute.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "Ora hai un " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " Nel tuo inventario hai: " + inventory;
    } else {
      text.innerText = "Non hai abbastanza oro per comprare un'arma.";
    }
  } else {
    text.innerText = "Hai già l'arma più potente!";
    button2.innerText = "Vendi l'arma per 15 oro";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "Hai venduto " + currentWeapon + ".";
    text.innerText += " Nel tuo inventario hai: " + inventory;
  } else {
    text.innerText = "Non vendere la tua unica arma!";
  }
}

function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "Il " + monsters[fighting].name + " attacca.";
  text.innerText += " Lo attacchi con " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " Mancato.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Il tuo " + inventory.pop() + " si rompe.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "Schivi l'attacco dal " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["bastone"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "Hai scelto " + guess + ". Ecco i numeri casuali:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Giusto! Vinci 20 oro!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Sbagliato! Perdi 10 salute!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}

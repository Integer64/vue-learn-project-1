const vm = new Vue({
  el: '#app',
  data: {
    isGameStarted: false,
    human: {
      name: 'player',
      health: 100,
    },
    monster: {
      name: 'monster',
      health: 100,
      actions: ['attack', 'specialAttack', 'heal'],
    },
    log: [],
    currentTurn: 0
  },
  methods: {
    writeLog(personName, victimName, actionName, healthPoints) {
      this.log.unshift({
        id: this.currentTurn + 1,
        person: personName,
        victim: victimName,
        action: actionName,
        points: healthPoints,
      });
    },
    generateHealthPoints() {
      return Math.floor(Math.random() * 10) + 1;
    },
    attack(attacker, victim) {
      const healthPoints = this.generateHealthPoints();
      victim.health -= healthPoints;
      this.writeLog(attacker.name, victim.name, 'attack', healthPoints);
    },
    heal(patient) {
      const healthPoints = this.generateHealthPoints();
      patient.health += healthPoints;
      this.writeLog(patient.name, 'himself', 'heal', healthPoints);
    },
    specialAttack(attacker, victim) {
      const hitPoints = this.generateHealthPoints();
      const specialHitPoints = Math.floor(hitPoints + hitPoints * Math.random());
      victim.health -= specialHitPoints;
      this.writeLog(attacker.name, victim.name, 's pecial attack', specialHitPoints);
    },
    makeAction(person, action) {
      let victim = null;
      if (person === this.human) {
        victim = this.monster;
      } else {
        victim = this.human;
      }

      switch (action) {
        case 'attack':
          this.attack(person, victim);
          break;
        case 'specialAttack':
          this.specialAttack(person, victim);
          break;
        case 'heal':
          this.heal(person);
          break;
        default:
          break;
      }
    },
    monsterTurn() {
      const indexAction = Math.floor(Math.random() * 3);
      this.makeAction(this.monster, this.monster.actions[indexAction]);
    },
    playerTurn(action) {
      this.makeAction(this.human, action);
      this.monsterTurn();
    },
    startGame() {
      this.isGameStarted = true;
      this.log = [];
      this.human.health = 100;
      this.monster.health = 100;
    },
  },
  watch: {
    'human.health': function(healthPoints) {
      if (healthPoints <= 0) {
        if (confirm('You are dead!\nStart new Game?')) {
          this.startGame();
        } else {
          this.isGameStarted = false;
        }
      } else if (healthPoints > 100) {
        this.human.health = 100;
      }
    },
    'monster.health': function(healthPoints) {
      if (healthPoints <= 0) {
        if (confirm('You are win!\nStart new Game?')) {
          this.startGame();
        } else {
          this.isGameStarted = false;
        }
      } else if (healthPoints > 100) {
        this.monster.health = 100;
      }
    },
  },
});

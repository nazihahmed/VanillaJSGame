var allEnemies;

var Character = function(cols,rows) {
    this.x = (cols-1)*101;
    this.y = (rows-1)*83 + 42;
    this.dcols = cols; // default number of columns
    this.drows = rows; // default number of rows
    this.cols = cols;
    this.rows = rows;
    this.sprite = null;
}

Character.prototype.render = function() {
    document.getElementById('level').innerHTML = 'Level: ' + allEnemies.length ;
    
    this.lastScore = this.score;
    this.lastcols = this.cols;
    var that = this;
    ctx.drawImage(Resources.get(that.sprite), this.x, this.y);
}

// Enemies our player must avoid
var Enemy = function(cols,rows) {
    Character.apply(this,arguments);

    this.speed = Math.floor(Math.random()*320 + 220);

    this.sprite = 'images/enemy-bug.png';
}

// inherit the Character prototype
Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Enemy;


Enemy.prototype.update = function(dt) {
    
    this.cols = Math.floor(this.x/101)+1;
    this.rows = Math.floor(this.y/83)+1;

    
    if (this.x <= 505) {
        this.x = (this.x + this.speed * dt);
    } else {
        // go to the first position if the enemey is 
        this.x = 0; // start from the first rowsumn
        // generate a new cols
        this.y = (Math.floor(Math.random()*3 + 1)-1)*83 + 42;
        // generate a new speed
        this.speed = Math.floor(Math.random()*320 + 220);
    } 

    if (this.cols == player.cols && this.rows == player.rows) {
        console.log("collision");
        player.reset();
    }

    if (this.cols == 5 && player.rows < 4 && this.cols != this.lastcols) {
        // if the 
        player.score++;
        document.getElementById('score').innerHTML = 'Score: ' + player.score;
    }    
    
}


var Player = function(cols,rows) {
    Character.apply(this,arguments);

    this.score = 0;
    this.highScore = 20;
    this.lastScore = this.score;
    this.sprite = 'images/char-boy.png';
}

// inherit the Character prototype
Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

// extend the prototype
Player.prototype.reset = function() {
    // reset the player to the original position
    this.x = (this.dcols-1)*101;
    this.y = (this.drows-1)*83 + 42;
    this.cols = this.dcols;
    this.rows = this.drows;
    this.score = 0;

    // reset high score
    document.getElementById('score').innerHTML = 'Score: 0';
}


Player.prototype.update = function(cols,rows) {
    var speed = Math.floor(Math.random()*3 + 1);
    if ((this.score == 5 || this.score == 50 || this.score == 100 || this.score == 250 || this.score == 400 ) && this.score !== this.lastScore) {
        allEnemies.push(new Enemy(1,speed));
    }

    if (typeof cols !== "undefined" && typeof rows !== "undefined" ) {
        if (!(this.y == 374 && rows == 1) && // 1 means down
            !(this.y == 42 && rows == -1) && // -1 means up
            !(this.x == 0 && cols == -1) && // -1 means left
            !(this.x == 404 && cols == 1)) // 1 means right
        { 
            this.x += cols * 101;
            this.y += rows * 83;
            this.cols += cols;
            this.rows += rows;
        }
    } 

    if (this.score > (localStorage.getItem('high-score') || this.highScore)) {
        // if the player's score is greater than the high score 
        // then the player high score will be the player's score
        this.highScore = this.score;
        localStorage.setItem('high-score', this.highScore);
        // change the high score element on the page
        document.getElementById('highScore').innerHTML = 'High Score: ' + localStorage.getItem('high-score');
    }

    if (this.score == 0) {
        // if the player loses , render only one enemey
        allEnemies = [allEnemies[0]];
    }

}



Player.prototype.handleInput = function(key) {
    
    switch(key) {
        case 'left':
            this.update(-1, 0);
            break;
        case 'up':
            this.update(0, -1);
            break;
        case 'right':
            this.update(1, 0);
            break;
        case 'down':
            this.update(0, 1);
            break;
    }

}

var allEnemies = [];

player = new Player(3,5); 

for(var i = 0;i<=1;i++) {

    var row = Math.floor(Math.random()*3 + 1);
    
    //setTimeout(function() {
        allEnemies.push(new Enemy(1,row));

        
    //},Math.floor(Math.random()*100 + 50))
    
}

document.getElementById('highScore').innerHTML = 'High Score: ' + (localStorage.getItem('high-score') || player.highScore);
// This listens for key presses and sends the kerows to your
// Player.handleInput() method. You don't need to modify this.

document.addEventListener('keyup', function(e) {
    
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    

    player.handleInput(allowedKeys[e.keyCode]);
});




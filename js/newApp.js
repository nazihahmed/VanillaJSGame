
var lastTime, now, timeout, player;

var Character = function(cols,rows) {
    this.x = (cols-1)*101;
    this.y = (rows-1)*83 + 42;
    this.dcols = cols; // default number of columns
    this.drows = rows; // default number of rows
    this.cols = cols;
    this.rows = rows;

}

// Enemies our player must avoid
var Enemy = function(cols,rows) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.prototype = new Character(cols, rows);
    this.prototype.constructor = Enemy;
    this.speed = Math.floor(Math.random()*320 + 220);
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    
    this.cols = Math.floor(this.x/101)+1;
    this.rows = Math.floor(this.y/83)+1;

    if (this.cols == player.cols && this.rows == player.rows) {
        // console.log('rowslision');
        player.reset();
    }
    

    if (this.x <= 505) {
        this.x = (this.x + this.speed * dt);
        var that = this;
    } else {
        // go to the first position if the enemey is 
        this.x = 0; // start from the first rowsumn
        // generate a new cols
        this.y = (Math.floor(Math.random()*3 + 1)-1)*83 + 42;
        // generate a new speed
        this.speed = Math.floor(Math.random()*320 + 220);
    } 

    if (player.score == 0) {
        // if the player loses , render only one enemey
        allEnemies = [allEnemies[0]];
    }
    
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {

    // if the player is in the enemey area and the enemey passed
    // and the the x steps are not the same as before (Important)
    // then update the player score
    if (this.cols == 5 && player.rows < 4 && this.cols != this.lastcols) {
        player.score++;
        document.getElementById('score').innerHTML = 'Score: ' + player.score;
    } 


    // the last x step is this step , for the next time render runs
    this.lastcols = this.cols;

    document.getElementById('level').innerHTML = 'Level: ' + allEnemies.length;
    
    var that = this;

//     requestAnimationFrame(function() {
        ctx.drawImage(Resources.get(that.sprite), this.x, this.y);    
//     });
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(cols,rows) {
    this.x = (cols-1)*101;
    this.y = (rows-1)*83 + 42;
    this.dcols = cols; // default number of colss
    this.drows = rows; // default rowsumn
    this.cols = cols;
    this.rows = rows;
    
    this.score = 0;
    this.highScore = 20;
    this.lastScore = this.score;
    // images are 101 * 83 (not all, it's the shown part only)

    // entire step in y is 83, half (approximatly) is 42
    // equation for y position: (steps-1)*83 + 42
    // equation for x position: (steps-1)*101

    this.sprite = 'images/char-boy.png';
}
// Player.prototype = new Character(this.cols, this.rows);
// Player.prototype.constructor = Player;

// Update the player's position, required method for game
Player.prototype.update = function(cols,rows) {
    
    if (typeof cols !== "undefined" && typeof rows !== "undefined" ) {
        if (!(this.y == 374 && rows == 1) && // 1 means down
            !(this.y == 42 && rows == -1) && // -1 means up
            !(this.x == 0 && cols == -1) && // -1 means left
            !(this.x == 404 && cols == 1)) { // 1 means right
            
            this.x += cols * 101;
            this.y += rows * 83;
            this.cols += cols;
            this.rows += rows;
            // console.log(this.x , this.y);
        }
        
    } 

    if (player.score > player.highScore) {
        player.highScore = player.score;
        document.getElementById('highScore').innerHTML = 'High Score: ' + player.score;
    }
    
}

// Draw the player on the screen, required method for game
Player.prototype.render = function(cols, rows) {
    // console.log('render');
    if ((this.score == 5 || this.score == 20 || this.score == 80 || this.score == 200 || this.score == 400 ) && this.score !== this.lastScore) {
        
        allEnemies.push(new Enemy(1,speed));
        
    }
    this.lastScore = this.score;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y); 
}

Player.prototype.reset = function() {
    this.x = (this.dcols-1)*101;
    this.y = (this.drows-1)*83 + 42;
    this.cols = this.dcols;
    this.rows = this.drows;
    this.score = 0;
    this.enemeies = 1;
    document.getElementById('score').innerHTML = 'Score: 0';
}

Player.prototype.handleInput = function(kerows) {
    
    switch(kerows) {
        case 'left':
            // go left
            this.update(-1, 0);
            console.log('left');
            break;
        case 'up':
            // go up
            this.update(0, -1);
            console.log('up');
            break;
        case 'right':
            // go right
            this.update(1, 0);
            console.log('right');
            break;
        case 'down':
            // go down
            this.update(0, 1);
            console.log('down');
            break;

    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

player = new Player(3,5);

for(var i = 0;i<=1;i++) {
    var speed = Math.floor(Math.random()*3 + 1);
    
    setTimeout(function() {
        allEnemies.push(new Enemy(1,speed));
    },Math.floor(Math.random()*100 + 50))
    
}

document.getElementById('highScore').innerHTML = 'High Score: ' + player.highScore;
// This listens for key presses and sends the kerows to your
// Player.handleInput() method. You don't need to modify this.

document.addEventListener('keyup', function(e) {
    
    var allowedKerows = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    

    player.handleInput(allowedKerows[e.keyCode]);
});


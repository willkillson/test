﻿
/*
 * GameDesign
 * - movement que
 *      So we can place multiple movements in a que, while we type.
 *      Movement nodes will be discrete, but it will take a specific amount of time to get
 *      to certain nodes.
 *      
 * - 11x11 movement nodes debateable
 * 
 * 
 * 
 * 
 * 
 */ 



/*NOTES
 * 
 * Abilities
 * /////////////////
 * -Auto tab tracking
 * -chance to
 * -chain breaking forgiveness
 * 
 * Elemental Damage - these elements are based on chinese five element philosophy
 * //https://upload.wikimedia.org/wikipedia/commons/0/07/FiveElementsCycleBalanceImbalance.jpg
 * -wood
 * -water
 * -fire
 * -earth
 * -metal
 * 
 * Stats
 * //////
 * -shield
 * -armor
 * -more health
 * -critical%
 * -damage
 * -chain multiplier (might go hand in hand with critical%)
 * 
 * Resistances
 * -wood
 * -water
 * -metal
 * -earth
 * -fire
 * 
 * 
 */



var canvasDem = 800;
var canvasCells = 10;

function Game() {

    
    var units = new Array();
    var player = new Player();
    var level = new Level();
    var ui = new UserInterface();


    this.init = function () {

        player.init(canvasDem / canvasCells / 2, canvasDem / canvasCells / 2, canvasDem, canvasDem);
        ui.init();
        level.init();



    }
    this.updateModel = function () {


        if (player.isAlive == 0) {
            level.level = 0;
            units = [];
            player.respawn();
        }

        //remake new units and increase level
        if (units.length == 0) {
            level.level++;
            for (let i = 0; i < level.level; i++) {
                let unit = new Unit();
                unit.init(canvasDem * Math.random(), canvasDem * Math.random(), level.level * Math.random(), level.level * Math.random(), "Q" + i, canvasDem, canvasDem);
                units.push(unit);
            }
        }





        //process input and check against units
        for (let i = 0; i < units.length; i++) {
            if (units[i].name == processText) {
                player.target =  units[i];
                processText = "";
            }
            units[i].update();
        }


        player.update();





        //check to see if any units are colliding with the player
        for (let i = 0; i < units.length; i++) {
            if (units[i].checkIfHittingPlayer(player)) {
                units[i].isAlive = 0;
                player.takeDamage(2);
            }
        }

        //check to see if any units have died and remove them
        for (let i = 0; i < units.length; i++) {
            if (units[i].isAlive == 0) {
                units.splice(i, 1);
            }
        }
    }
    this.composeFrame = function () {
        for (let i = 0; i < units.length; i++) {
            units[i].draw();
        }




        ui.draw();
        level.draw();
        player.draw();




    }

}




//GameObjects

function UserInterface() {
    this.inputTextSize;
    this.textPos = new Vec2(100, 700);

    this.init = function () {
        this.inputTextSize = 30;

    }
    this.draw = function(){

        //keyboardInput
        ctx.beginPath();
        ctx.font = "" + this.inputTextSize + "px Arial";
        ctx.fillStyle = "gray";
        ctx.fillText(inputTextValue, this.textPos.x, this.textPos.y);

    }
}

function Level() {
    this.level;
    this.textSizeLevelDisplay;

    this.init = function (levelNum) {
        this.textSizeLevelDisplay = 30;
        this.level = 1;
    }
    this.draw = function(){
        //leveldisplay
        ctx.beginPath();
        ctx.font = "" + this.textSizeLevelDisplay + "px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("Level - " + this.level, 450, 50);


        //grid
        ctx.beginPath();
        ctx.strokeStyle = 'teal';

        for (let i = canvasDem / canvasCells; i < canvasDem; i = i + canvasDem / canvasCells) {
            ctx.moveTo(i, 0);

            ctx.lineTo(i, canvasDem);
            ctx.stroke();
        }
        for (let i = canvasDem / canvasCells; i < canvasDem; i = i + canvasDem / canvasCells) {
            ctx.moveTo(0, i);

            ctx.lineTo(canvasDem, i);
            ctx.stroke();
        }

        //boundary
        ctx.beginPath();
        ctx.strokeStyle = 'brown';
        ctx.moveTo(0, 0);
        ctx.lineTo(0, canvasDem);

        ctx.moveTo(0, canvasDem);
        ctx.lineTo(canvasDem, canvasDem);

        ctx.moveTo(canvasDem, canvasDem);
        ctx.lineTo(canvasDem, 0);

        ctx.moveTo(canvasDem, 0);
        ctx.lineTo(0, 0);
        ctx.stroke();






    }

    this.restart = function () {
        this.level = 1;
    }
}

function Unit() {

    this.currentHealth;
    this.health;

    this.dictionary;

    this.name;
    this.position;
    this.velocity;

    this.radius;
    this.boundx;
    this.boundy;

    this.isAlive;



    this.init = function(x,y,velx,vely,name,bx,by){
        this.position = new Vec2(x, y);
        this.velocity = new Vec2(velx, vely);
        this.name = name;
        this.boundx = bx;
        this.boundy = by;

        this.health = 2;//HARDCODE
        this.currentHealth = this.health;
        this.isAlive = 1;//HARDCODE
        this.radius = 25;


        this.dictionary = new Array();
        for (let i = 0; i < this.health; i++) {
            this.dictionary.push(dictionary[Math.floor(dictionary.length * Math.random())]);
        }

    }
    this.update = function () {
        if (this.currentHealth <= 0) {
            this.isAlive = 0;
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        //bounds x right side
        if (this.position.x >= this.boundx - this.radius) {
            this.position.x = this.boundx - this.radius;
            this.velocity.x = this.velocity.x*-1;
        }
        if (this.position.x - this.radius <= 0) {
            this.position.x = this.radius;
            this.velocity.x = this.velocity.x * -1;
        }
        //south check
        if (this.position.y >= this.boundy - this.radius) {
            this.position.y = this.boundy - this.radius;
            this.velocity.y = this.velocity.y * -1;
        }

        if (this.position.y - this.radius <= 0) {
            this.position.y = this.radius;
            this.velocity.y = this.velocity.y * -1;
        }
        //console.log("x,y(" + this.position.x +", " + this.position.y+")");

  
    }
    this.draw = function () {

        //display name
        ctx.beginPath();
        ctx.font = "20px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(this.name, this.position.x - 25, this.position.y - 30);


        //display health
        ctx.beginPath();
        ctx.font = "10px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("HP - " + this.currentHealth, this.position.x - 22, this.position.y + 5);


        //avatar
        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.stroke();
    }

    this.checkIfHittingPlayer = function (player) {


        if ((player.position.x + player.radius > this.position.x) && (player.position.x < player.radius + this.position.x)) {
            if ((player.position.y + player.radius > this.position.y) && (player.position.y < player.radius + this.position.y)) {
                return 1;
            }

        }
        return 0;

    }

}

function Player() {

    this.spawnPosition;
    this.position;

    this.currentHealth;
    this.health;
    
    this.boundx;
    this.boundy;
    this.radius;

    this.target = null;

    this.isAlive;



    this.init = function (x, y, bx, by) {
        this.spawnPosition = new Vec2(x, y);
        this.position = this.spawnPosition;
        this.boundx = bx;
        this.boundy = by;

        this.health = 10;
        this.currentHealth = this.health;

        this.radius = canvasDem / canvasCells;

        this.isAlive = 1;
    }
    this.update = function () {

        if (this.target != null) {
            if (this.target.isAlive == 0) {

                this.target = null;

            }
        }

        if (this.target != null) {
            if (this.target.dictionary[this.target.currentHealth - 1] == processText) {
                this.target.currentHealth--;
                processText = "";
            }
       
        }



        switch (processText) {
            case "_PlayerMovement_right":
                processText = "";

                this.position.x += canvasDem / canvasCells;
                break;
            case "_PlayerMovement_up":
                processText = "";
                this.position.y -= canvasDem / canvasCells;
                break;
            case "_PlayerMovement_down":
                processText = "";
                this.position.y += canvasDem / canvasCells;
                break;
            case "_PlayerMovement_left":
                processText = "";
                this.position.x -= canvasDem / canvasCells;
                break;
            case "FIRE":
                processText = "";
                if (this.target != null) {
                    this.target.currentHealth -= 1;
                }
                break;
        }


        ////bounds x right side
        //if (this.position.x >= this.boundx) {
        //    this.position.x = this.boundx;
        //    this.velocity.x = this.velocity.x * -1;
        //}
        //if (this.position.x <= 0) {
        //    this.position.x = 0;
        //    this.velocity.x = this.velocity.x * -1;
        //}
        //if (this.position.y >= this.boundy) {
        //    this.position.y = this.boundy;
        //    this.velocity.y = this.velocity.y * -1;
        //}
        //if (this.position.y <= 0) {
        //    this.position.y = 0;
        //    this.velocity.y = this.velocity.y * -1;
        //}

    }
    this.draw = function () {

        if (this.target != null) {

            //display target line
            ctx.beginPath();
            ctx.strokeStyle = 'purple';
            ctx.moveTo(this.position.x, this.position.y);
            ctx.lineTo(this.target.position.x, this.target.position.y);
            ctx.stroke();


            //display dictionary
            ctx.beginPath();
            ctx.font = "20px Arial";
            ctx.fillStyle = "black";
            ctx.fillText(this.target.dictionary[this.target.currentHealth-1], this.position.x - 25, this.position.y - 30);


            //display word count
            ctx.beginPath();
            ctx.font = "10px Arial";
            ctx.fillStyle = "black";
            ctx.fillText("word: " + this.target.currentHealth + " - " + this.target.health, this.position.x - 25, this.position.y - 60);
        }


        //display health
        ctx.beginPath();
        ctx.font = "10px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("HP - " + this.currentHealth, this.position.x - 22, this.position.y + 5);

        //display character avatar
        ctx.beginPath();
        ctx.strokeStyle = 'green';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 25, 0, 2 * Math.PI);
        ctx.stroke();
    }
    this.takeDamage = function (amount) {
        this.currentHealth -= amount;
        if (this.currentHealth <= 0) {
            this.isAlive = 0;
        }
    }
    this.respawn = function () {
        this.position = this.spawnPosition;
        this.isAlive = 1;
        this.currentHealth = this.health;
        this.target = null;
    }
}


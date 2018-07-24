﻿
function Game() {

    var level = 1;
    var inputTextSize = 30;
    var textPos = new Vec2(100 ,700);
    var units = new Array();

    var player = new Player();


    this.init = function () {
        //this.canvasHeight = 800;
        //this.canvasWidth = 600;

        for (let i = 0; i < 1; i++) {
            let unit = new Unit();
            unit.init(600*Math.random(), 800*Math.random(), 1*Math.random(), 1*Math.random(),"Q"+i,600,800);
            units.push(unit);
        }

        player.init(600 / 2, 800 / 2, 600, 800);



    }
    this.updateModel = function () {


        for (let i = 0; i < units.length; i++) {

    
            if (units[i].name == processText) {
                player.target =  units[i];
                //console.log("Killing " + units[i].name);
                //squish.play();
                processText = "";
      
                //units.splice(i, 1);

            }
            units[i].update();
        }
        player.update();


        if (units.length == 0) {
            level++;
            for (let i = 0; i < level; i++) {
                let unit = new Unit();
                unit.init(600 * Math.random(), 800 * Math.random(), level * Math.random(), level* Math.random(), "Q" + i, 600, 800);
                units.push(unit);
            }
        }



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


        player.draw();


        //keyboardInput
        ctx.beginPath();
        ctx.font = "" + inputTextSize+"px Arial";
        ctx.fillStyle = "blue";
        ctx.fillText(inputTextValue, textPos.x, textPos.y);

        //leveldisplay
        ctx.beginPath();
        ctx.font = "" + inputTextSize + "px Arial";
        ctx.fillStyle = "red";
        ctx.fillText("Level - " + level, 450, 50);
        
    }

}

function Unit() {

    this.currentHealth;
    this.health;

    this.dictionary;

    this.name;
    this.position;
    this.velocity;

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


        this.dictionary = new Array();
        for (let i = 0; i < this.health; i++) {
            this.dictionary.push(dictionary[Math.floor(dictionary.length * Math.random())]);
        }
        console.log(this.dictionary);
    }
    this.update = function () {
        if (this.currentHealth <= 0) {
            this.isAlive = 0;
            console.log(this.name +" is dead");
        }

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        //bounds x right side
        if (this.position.x >= this.boundx) {
            this.position.x = this.boundx;
            this.velocity.x = this.velocity.x*-1;
        }
        if (this.position.x <= 0) {
            this.position.x = 0;
            this.velocity.x = this.velocity.x * -1;
        }
        if (this.position.y >= this.boundy) {
            this.position.y = this.boundy;
            this.velocity.y = this.velocity.y * -1;
        }
        if (this.position.y <= 0) {
            this.position.y = 0;
            this.velocity.y = this.velocity.y * -1;
        }

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
        ctx.arc(this.position.x, this.position.y, 25, 0, 2 * Math.PI);
        ctx.stroke();
    }

}

function Player() {
    this.position;

    this.currentHealth;
    this.health;
    
    this.boundx;
    this.boundy;

    this.target = null;

    this.isAlive;



    this.init = function (x, y, bx, by) {
        this.position = new Vec2(x, y);
        this.boundx = bx;
        this.boundy = by;

        this.health = 10;
        this.currentHealth = this.health;

        this.isAlive = 1;
    }
    this.update = function () {

        if (this.target != null) {
            if (this.target.isAlive == 0) {

                this.target = null;

            }


     

        }

        if (this.target != null) {
            //console.log(processText);

            //console.log(this.target.dictionary[1]);
            if (this.target.dictionary[this.target.currentHealth - 1] == processText) {
                this.target.currentHealth--;
                processText = "";
            }
       
        }



        switch (processText) {
            case "_PlayerMovement_right":
                processText = "";
                this.position.x += 40;
                break;
            case "_PlayerMovement_up":
                processText = "";
                this.position.y -= 40;
                break;
            case "_PlayerMovement_down":
                processText = "";
                this.position.y += 40;
                break;
            case "_PlayerMovement_left":
                processText = "";
                this.position.x -= 40;
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

        if (this.target !=null) {
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

}

function Vec2(x, y) {
    this.x = x;
    this.y = y;
}



var dictionary = new Array();

dictionary.push("grouchy");
dictionary.push("care");
dictionary.push("match");
dictionary.push("weary");
dictionary.push("snails");
dictionary.push("market");
dictionary.push("mature");
dictionary.push("lethal");
dictionary.push("abortive");
dictionary.push("poop");
dictionary.push("crap");
dictionary.push("pain");
for (let i = 0; i < dictionary.length; i++) {
    dictionary[i] = dictionary[i].toUpperCase();
}
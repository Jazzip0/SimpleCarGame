function PlayerCar(id,c){ //constructor
	var self = this;
	if(c == null){ //if color is not previously defined
		var color = host.pixi.randomPleasingColor(255,155,10);
		c = host.pixi.rgb2hsl(color.r,color.g,color.b);
	}
	else
		c = host.pixi.hex2hsl(c.substring(1)); //change color so that pixi understands it
	Car.call(this,Math.random() * (host.pixi.width / 1.5) + host.pixi.width / 4,host.pixi.height / 2, 80, 110,c);
	this.carGraphic = this.createCarGraphic();
	this.carGraphic.scale.x = this.w / this.carGraphic.w;
	this.carGraphic.scale.y = this.h / this.carGraphic.h;
	this.addChild(this.carGraphic);
	this.carGraphic.scale.x = this.w / this.carGraphic.w;
	this.carGraphic.scale.y = this.h / this.carGraphic.h;
	this.id = id;
	this.timeOffset = Math.PI * Math.random();
	this.centerY = this.y;
	this.move = {x:0,y:0};
	this.lifeCars = new PIXI.Container();
	this.updateHeightLifeCars(host.pixi.players.length);
	this.addLifes(10);
	host.pixi.stage.addChild(this.lifeCars);
	this.lifesActivated = false;
	var lengthTimer = 350;
	this.timeOutLifesActivated = 5000 / lengthTimer;
	this.timer = setInterval(function(){
		if(self.alpha < 0.6)
			self.alpha = 1;
		else
			self.alpha = 0.1;
		if(self.lifesActivated && self.timeOutLifesActivated-- < 0){
			self.alpha = 1;
			window.clearInterval(self.timer);
			self.timer = null;
		}
	}, lengthTimer);
	this.left = 37; //set left standart to left key
	this.right = 39; ///set right standard to right key


}
PlayerCar.prototype = Object.create(Car.prototype);



PlayerCar.prototype.lifesDeactivatedDisplay = function() {
};

PlayerCar.prototype.display = function(){
	if(this.x + this.move.x < host.pixi.width - this.h / 2 - host.pixi.MARGIN && this.x + this.move.x > host.pixi.MARGIN){
		if(this.remote == undefined || !this.remote){
			if(host.pixi.pressedKeys[this.left])
				this.x -= this.maxMove;
			if(host.pixi.pressedKeys[this.right])
				this.x += this.maxMove;
		}else
		this.x += this.move.x;
	}
	this.y = this.centerY + Math.sin(this.timeOffset + host.pixi.frames / 200) * this.h;
}

PlayerCar.prototype.maxMove = 10;

PlayerCar.prototype.remove = function(other){
	if(this.lifesActivated && this.timer == null){
		var lifesLeft = this.lifeCars.children.length;
		if(lifesLeft > 0){
			this.lifeCars.removeChildAt(this.lifeCars.children.length - 1);
			host.socket.feedback({message:"update lifes",lifes:lifesLeft},this.id);
		}else{
			host.pixi.removePlayer(this.id);
			host.socket.feedback({message:"You ended the game",lifes:lifesLeft},this.id);
		}
	}
}

PlayerCar.prototype.updateHeightLifeCars = function(row) {
	var margin = 5; //TODO is already in LifeCar
	this.lifeCars.y = (this.h / 2 + margin) * row + margin; //add new row of life cars on correct height
};

PlayerCar.prototype.addLifes = function(amount) {
	for(var i = 0; i <= amount; i++){
		this.lifeCars.addChild(new LifeCar(this.lifeCars.children.length,this.c,this));
	}
};

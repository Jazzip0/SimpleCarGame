function Pixi(){
	
	this.amountOfCars = 0;
	this.paused = false;
	this.frames = 0;
	this.startFrame = -1; //-1 means no game is started
	this.started = false;
	var self = this;
	this.pressedKeys = {};
	$(window).keydown(function(event){
		self.pressedKeys[event.keyCode] = true;
	}).keyup(function(event){
		self.pressedKeys[event.keyCode] = false;;
	});
	self.width = $('body').width();
	self.height = $(window).height();
	this.MARGIN = 200 * this.width / 1920;
	self.renderer = new PIXI.autoDetectRenderer(self.width,self.height,null,false,true);
	$('#game').append(this.renderer.view);
	self.stage = new PIXI.Stage(0xC8C8C8);
	this.background = new Background(self.width,self.height,this.MARGIN);
	self.stage.addChild(this.background);
	this.brakeLineLayer = new PIXI.DisplayObjectContainer();
	self.stage.addChild(this.brakeLineLayer);

	this.text = new PIXI.Text("",{font:"30px Arial", fill:"red"});
	this.text.x = self.width / 2 - 100;
	this.text.y = self.height - 50;
	self.stage.addChild(this.text);

		this.animate = function(){//animation loop
			//self.collisionCheck();
			self.frames++;
			self.renderer.render(self.stage);
			self.players.forEach(function(p){
				p.display();
			});
			self.selfDrivingCars.forEach(function(p){
				p.display();
			});
			self.background.update();

			self.brakeLines.forEach(function(b){
				b.update();
			});

			if(self.startFrame != -1){ //if a game is running
			var currentRunTime = (self.frames - self.startFrame) / 60; //current run time given an average of 60fps
			self.text.setText(Math.round(currentRunTime));
			var tempAmountOfCars = Math.round((Math.round( currentRunTime / 10)  - currentRunTime / 10) * 1000) / 1000;
			if(tempAmountOfCars == 0){ //start with 25 cars and add every 10 seconds a new car
				self.addSelfDrivingCars(1);
				host.datVars.amountOfCars = self.amountOfCars;
			}
		}
		if(!self.paused)
			requestAnimFrame(self.animate);
	}

	this.selfDrivingCars = [];
	this.collisionCars = [];

	$(window).resize(function(){
		self.width = $('body').width();
		self.height = $(window).height();
		self.renderer.resize(self.width,self.height);
		self.MARGIN = 200* (self.width / 1920);
		self.background.resize();
	});
	requestAnimFrame(this.animate);
}
Pixi.prototype.collisionCheck = function() {
	var checkCars = this.collisionCars.slice();
	for (var i = checkCars.length - 1; i >= 0 ; i--) {
		var car = checkCars[i];
		car.smallestDist = -1;
		car.smallestDistX_L = -1;
		car.smallestDistX_R = -1;
		car.voorliggerSpeed = -1;
	}
	for (var i = checkCars.length - 1; i >= 0 ; i--) {
		var car0 = checkCars[i];
		for (var q = i - 1; q >= 0; q--) {
			var car1 = checkCars[q];
			var distY =car1.y + car1.h / 2 - car0.y - car0 .h / 2;
			var distX =car1.x + car1.w / 2 - car0.x - car0 .w / 2;
			if (Math.abs(distX) < car1 .w / 2 + car0.w / 2){
				if(Math.abs(distY) < car1 .h / 2 + car0.h / 2){
					car0.remove();
					car1.remove();
					checkCars.splice(i,1);
					checkCars.splice(q,1);
					i -= 2;
					break;
				}else {
					if(distY > 0 && (distY < car0.smallestDist || car0.smallestDist == -1 )){
						car0.smallestDist = distY - car0.h / 2 - car1.h / 2;
						car0.voorliggerSpeed = car1.speed;
					}else if(distY < 0 && (-distY < car1.smallestDist || car1.smallestDist == -1 )){
						car1.smallestDist = -distY - car0.h / 2 - car1.h / 2;
						car1.voorliggerSpeed = car0.speed;
					}
				}
			}
		}
		car0.text.setText(car0.smallestDist + "");
	}
};
Pixi.prototype.startAnim = function() {
	requestAnimFrame(this.animate);
};
Pixi.prototype.removePlayer = function(id) {
	var index = $.map(host.pixi.players, function(obj, index) {if(obj.id == id) {return index;}});
	console.debug("remove @: " + index);
	if(index >= 0 && index != ""){
		var player = host.pixi.players[index];
		host.pixi.stage.removeChild(player.lifeCars);
			host.pixi.stage.removeChild(player); //remove from canvas
			delete host.pixi.players[index]; //remove object from memory
			host.pixi.players.splice(index,1);
			host.pixi.updateCollisionCars();
		}
		for(var i = 0; i < host.pixi.players.length; i++){ //whenever a player car is deleted update the row of lifecars to the correct heigth
			host.pixi.players[i].updateHeightLifeCars(i);
		}
	};
	Pixi.prototype.updateCollisionCars = function() {
		this.amountOfCars = this.selfDrivingCars.length;
		this.collisionCars = this.selfDrivingCars.concat(this.players);
	};
	Pixi.prototype.players = [];
	Pixi.prototype.rgb2hex = function(r,g,b) {
		var decColor =0x1000000+ b + 0x100 * g + 0x10000 *r ;
		return '0x'+decColor.toString(16).substr(1);
	};
	Pixi.prototypehex
	Pixi.prototype.hsl2hex = function  (h, s, l) {
		h = h / 250;
		s = s / 250;
		l = l / 250;
		var r, g, b;

		if(s == 0){
        r = g = b = l; // achromatic
    }else{
    	var hue2rgb = function hue2rgb(p, q, t){
    		if(t < 0) t += 1;
    		if(t > 1) t -= 1;
    		if(t < 1/6) return p + (q - p) * 6 * t;
    		if(t < 1/2) return q;
    		if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    		return p;
    	}

    	var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    	var p = 2 * l - q;
    	r = hue2rgb(p, q, h + 1/3);
    	g = hue2rgb(p, q, h);
    	b = hue2rgb(p, q, h - 1/3);
    }
    return this.rgb2hex(Math.round(r * 255),Math.round(g * 255),Math.round(b * 255));
}

Pixi.prototype.rgb2hsl = function(r,g,b) {
	r /= 255, g /= 255, b /= 255;
	var max = Math.max(r, g, b), min = Math.min(r, g, b);
	var h, s, l = (max + min) / 2;

	if(max == min){
        h = s = 0; // achromatic
    }else{
    	var d = max - min;
    	s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    	switch(max){
    		case r: h = (g - b) / d + (g < b ? 6 : 0); break;
    		case g: h = (b - r) / d + 2; break;
    		case b: h = (r - g) / d + 4; break;
    	}
    	h /= 6;
    }

    return {h:h * 255,s:s * 255,l:l * 255};
};

Pixi.prototype.hex2hsl = function(hex) {
	 // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	 var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	 hex = hex.replace(shorthandRegex, function(m, r, g, b) {
	 	return r + r + g + g + b + b;
	 });

	 var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    // return result ? {
    //     r: parseInt(result[1], 16),
    //     g: parseInt(result[2], 16),
    //     b: parseInt(result[3], 16)
    // } : null;
    return this.rgb2hsl(parseInt(result[1], 16),parseInt(result[2], 16),parseInt(result[3], 16));
}
	Pixi.prototype.randomPleasingColor = function(r,g,b) {//create a random color that is aesthetically pleasing with the input
		var red = Math.round((r / 4 + Math.random() * 255) / 1.25);
		var green = Math.round((g / 4 + Math.random() * 255) / 1.25);
		var blue = Math.round((b / 4 + Math.random() * 255) / 1.25);
		return {r:red,g:green,b:blue};
	};
	Pixi.prototype.createRect = function(x,y,w,h,c){
		$rect = new PIXI.Graphics();
		$rect.beginFill(c);
		$rect.drawRect(x,y,w,h);
		return $rect;
	}
	Pixi.prototype.createEllipse = function(x,y,w,h,c){
		$el = new PIXI.Graphics();
		$el.beginFill(c);
		$el.drawEllipse(x,y,w,h);

		return $el;
	}

	Pixi.prototype.addSelfDrivingCars = function(amount){//function for removing and adding selfdrivingcars
		this.amountOfCars += amount;
		if(amount > 0){ //add
			for (var i = 1; i <= amount; i++){
				if(!this.addNonNormalCar()) //add non normal car or false and add an "normal" selfdriving car
					host.pixi.selfDrivingCars.push(new NormalCar());
			}
		}else if(amount < 0){ //remove
			host.pixi.selfDrivingCars.forEach(function(car){
				if(amount >= 0 ) //if enough cars are removed
					return;
				else if(car.y < -car.h){ //if car is offscreen
					car.removeIndefinitely();
					amount++;
				}
			});
			while(amount < 0){ //if not enough cars are offscreen remove cars on screen
				host.pixi.selfDrivingCars[0].removeIndefinitely();
				amount++;
			}
		}
		host.pixi.updateCollisionCars();

	}

	Pixi.prototype.addNonNormalCar = function(){
		
		if(Math.round(Math.random() * 10) == 0)//1% chance on a ambulance
			host.pixi.selfDrivingCars.push(new AmbuCar());
		else if(Math.round(Math.random() * 5) == 0)//1% chance on a truck
			host.pixi.selfDrivingCars.push(new Truck());
		else
			return false;	
		return true;
	}

	Pixi.prototype.brakeLines = [];

	Pixi.prototype.createPlayer = function(id,c) {
		var player = new PlayerCar(id,c);
		host.pixi.players.push(player);//add player to player list
		host.pixi.updateCollisionCars();
		if(host.pixi.started)
			player.lifesActivated = true;
		return player;
	};
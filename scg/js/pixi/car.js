function Car(x,y,w,h,c){
PIXI.DisplayObjectContainer.call(this); //create container for all graphics 
host.pixi.stage.addChild(this);
this.x = x;
this.y = y;
this.h = h;
this.w = w;
this.c = c;	
//this.addChild(host.pixi.createRect(0,0,w ,h ,host.pixi.rgb2hex(200,0,0))); //TODO create better fitting hitbox

this.brakeLights = new PIXI.DisplayObjectContainer();
this.brakeLights.addChild(host.pixi.createRect(w * 0.05,0,w * 0.2,h * 0.1,host.pixi.rgb2hex(200,0,0))); //left light;
this.brakeLights.addChild(host.pixi.createRect(w * 0.75,0,w * 0.2,h * 0.1,host.pixi.rgb2hex(200,0,0))); //left light;
this.smallestDist = -1;
this.crackInSight = false;
this.smallestDistX_L = -1;
this.smallestDistX_R = -1;
// this.text = new PIXI.Text("test",{font:"30px Arial", fill:"red"});
// this.text.y -= 50;
// this.addChild(this.text);

this.speed = 0;
}

Car.prototype = PIXI.DisplayObjectContainer.prototype;

Car.prototype.remove = function(other){
	host.pixi.stage.removeChild(this);
}

Car.prototype.createCarGraphic = function() {
	var c = this.c;
	var body = new PIXI.Polygon([
		new PIXI.Point(10,10),
		new PIXI.Point(20, 0),
		new PIXI.Point(150, 0),
		new PIXI.Point(160, 10),
		new PIXI.Point(160, 260),
		new PIXI.Point(150, 270),
		new PIXI.Point(20, 270),
		new PIXI.Point(10,260),]);

	var hood = new PIXI.Polygon([
		new PIXI.Point(30,10),
		new PIXI.Point(140, 10),
		new PIXI.Point(150, 80),
		new PIXI.Point(20, 80),]);
	var windshield = new PIXI.Polygon([
		new PIXI.Point(20,80),
		new PIXI.Point(150, 80),
		new PIXI.Point(140, 120),
		new PIXI.Point(30, 120),]);

	var roof = new PIXI.Polygon([
		new PIXI.Point(30,120),
		new PIXI.Point(140, 120),
		new PIXI.Point(140, 200),
		new PIXI.Point(30, 200),]);
	var backwindow = new PIXI.Polygon([
		new PIXI.Point(30, 200),
		new PIXI.Point(140, 200),
		new PIXI.Point(150,220),
		new PIXI.Point(20, 220),]);
	var tailgate = new PIXI.Polygon([
		new PIXI.Point(20, 220),
		new PIXI.Point(150, 220),
		new PIXI.Point(150,260),
		new PIXI.Point(20, 260),]);

	var wheelarchLT = new PIXI.Polygon([
		new PIXI.Point(0, 30),
		new PIXI.Point(10, 20),
		new PIXI.Point(10,90),
		new PIXI.Point(0, 80),]);
	var wheelarchRT = new PIXI.Polygon([
		new PIXI.Point(160, 20),
		new PIXI.Point(170, 30),
		new PIXI.Point(170,80),
		new PIXI.Point(160,90),]);
	var wheelarchLB = new PIXI.Polygon([
		new PIXI.Point(0, 180),
		new PIXI.Point(10, 170),
		new PIXI.Point(10,240),
		new PIXI.Point(0, 230),]);
	var wheelarchRB = new PIXI.Polygon([
		new PIXI.Point(160, 170),
		new PIXI.Point(170, 180),
		new PIXI.Point(170,230),
		new PIXI.Point(160,240),]);

	var car = new PIXI.Graphics();
	car.beginFill(host.pixi.hsl2hex(c.h,c.s,c.l));
	car.drawShape(body);
	car.endFill();
	car.beginFill(host.pixi.hsl2hex(c.h,c.s,c.l + 21));
	car.drawShape(hood);
	car.drawShape(roof);
	car.drawShape(tailgate);
	car.endFill();
	car.beginFill(0xa7dbdd);
	car.drawShape(windshield);
	car.drawShape(backwindow);
	car.endFill();
	car.beginFill(host.pixi.hsl2hex(c.h,c.s,(c.l - 25)));
	car.drawShape(wheelarchRB);
	car.drawShape(wheelarchLB);
	car.drawShape(wheelarchRT);
	car.drawShape(wheelarchLT);
	car.w = 180;
	car.h = 260;
	return car;
};

Car.prototype.collision =function(){
	this.smallestDist = -1;
	this.smallestDistX_L = -1;
	this.smallestDistX_R = -1;
	this.voorliggerSpeed = -1;
	host.pixi.collisionCars.forEach(function(element){

		if(this != element){
			var distY =element.y + element.h / 2 - this.y - this.h / 2;
			var distX =element.x + element.w / 2 - this.x - this.w / 2;
			if (Math.abs(distX) < this.w / 2 + element.w / 2){
				if(Math.abs(distY) < this.h / 2 + element.h / 2){

						this.remove(element);
					if(element.y > -element.h) //also remove other car when it is visible on screen
						element.remove(this);
				
				return;
			}else if(distY > 0 && (distY < this.smallestDist || this.smallestDist == -1 )){
				this.smallestDist = distY - this.h / 2 - element.h / 2;
				this.voorliggerSpeed = element.speed;

			}

		}else if(distY > -this.h && distY < this.h / 2){
			if(distX > 0 && (distX < this.smallestDistX_R  || this.smallestDistX_R  == -1 )){
				this.smallestDistX_R = distX;
			}else if(distX < 0 && (distX > this.smallestDistX_L  || this.smallestDistX_L  == -1 )){
				this.smallestDistX_L = distX;
			}
		}
	}
}.bind(this));
}
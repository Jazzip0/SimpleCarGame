function AmbuCar(){
	SelfDrivingCar.call(this,64,120);
	this.carGraphic = this.createAmbuGraphic();
	this.carGraphic.scale.x = this.w / this.carGraphic.w;
	this.carGraphic.scale.y = this.h / this.carGraphic.h;
	this.carGraphic.pivot.x = 166;
	this.carGraphic.pivot.y = 290;
	this.carGraphic.rotation = Math.PI;
	this.addChild(this.carGraphic);
	this.text = new PIXI.Text("1 up",{font:"12px Arial"});
	this.text.y = -25;
	this.addChild(this.text);
}

AmbuCar.prototype = Object.create(SelfDrivingCar.prototype);

AmbuCar.prototype.remove = function(other) {
	// var spawningLengthNeeded = (this.SpawnOpp * host.pixi.amountOfCars) / host.pixi.width;
	// this.y = - this.h - Math.random() * spawningLengthNeeded;
	// this.x =  Math.random() * (host.pixi.width - this.w);
	// this.speed = this.getSpeed(); 
	// this.oldSpeed = this.speed;
	this.removeIndefinitely();
	host.pixi.addSelfDrivingCars(1);
	if(other != undefined && other.lifeCars != undefined && other.lifesActivated && other.timer == null) //if other is a player 
		other.addLifes(1);
	
};

AmbuCar.prototype.createAmbuGraphic = function() {
var c = {h:0,s:0,l:225};
	var body = new PIXI.Polygon([
		new PIXI.Point(10,10),
		new PIXI.Point(20, 0),
		new PIXI.Point(150, 0),
		new PIXI.Point(160, 10),
		new PIXI.Point(160, 280),
		new PIXI.Point(150, 290),
		new PIXI.Point(20, 290),
		new PIXI.Point(10,280),]);

	var hood = new PIXI.Polygon([
		new PIXI.Point(30,10),
		new PIXI.Point(140, 10),
		new PIXI.Point(150, 80),
		new PIXI.Point(20, 80),]);
	var windshield = new PIXI.Polygon([
		new PIXI.Point(20,80),
		new PIXI.Point(150, 80),
		new PIXI.Point(145, 100),
		new PIXI.Point(25, 100),]);

	var roof = new PIXI.Polygon([
		new PIXI.Point(25,100),
		new PIXI.Point(145, 100),
		new PIXI.Point(145, 280),
		new PIXI.Point(25, 280),]);
	var lightBar = new PIXI.Polygon([
		new PIXI.Point(20,120),
		new PIXI.Point(150, 120),
		new PIXI.Point(150, 140),
		new PIXI.Point(20, 140),]);
	var innerLightBar = new PIXI.Polygon([
		new PIXI.Point(27,126),
		new PIXI.Point(143, 126),
		new PIXI.Point(143, 134),
		new PIXI.Point(27, 134),]);
	var cross =  new PIXI.Polygon([
		new PIXI.Point(70, 230),
		new PIXI.Point(40, 230),
		new PIXI.Point(40, 200),
		new PIXI.Point(70, 200),
		new PIXI.Point(70, 170),
		new PIXI.Point(100, 170),
		new PIXI.Point(100, 200),
		new PIXI.Point(130, 200),
		new PIXI.Point(130, 230),
		new PIXI.Point(100, 230),
		new PIXI.Point(100, 260),
		new PIXI.Point(70, 260),]);

	var wheelarchLT = new PIXI.Polygon([
		new PIXI.Point(4, 30),
		new PIXI.Point(10, 20),
		new PIXI.Point(10,90),
		new PIXI.Point(4, 80),]);
	var wheelarchRT = new PIXI.Polygon([
		new PIXI.Point(160, 20),
		new PIXI.Point(166, 30),
		new PIXI.Point(166,80),
		new PIXI.Point(160,90),]);
	var wheelarchLB = new PIXI.Polygon([
		new PIXI.Point(4, 190),
		new PIXI.Point(10, 180),
		new PIXI.Point(10,250),
		new PIXI.Point(4, 240),]);
	var wheelarchRB = new PIXI.Polygon([
		new PIXI.Point(160, 180),
		new PIXI.Point(166, 190),
		new PIXI.Point(166,240),
		new PIXI.Point(160,250),]);

	var car = new PIXI.Graphics();
	car.beginFill(host.pixi.hsl2hex(c.h,c.s,c.l));
	car.drawShape(body);
	car.endFill();
	car.beginFill(host.pixi.hsl2hex(c.h,c.s,c.l + 21));
	car.drawShape(hood);
	car.drawShape(roof);
	car.endFill();
	car.beginFill(host.pixi.hsl2hex(0,166,150));
	car.drawShape(cross);
	car.endFill();
	car.beginFill(host.pixi.hsl2hex(157,250,167));
	car.drawShape(lightBar);
	car.endFill();
	car.beginFill(host.pixi.hsl2hex(157,250,186));
	car.drawShape(innerLightBar);
	car.endFill();
	car.beginFill(0xa7dbdd);
	car.drawShape(windshield);
	car.endFill();
	car.beginFill(host.pixi.hsl2hex(c.h,c.s,(c.l - 75)));
	car.drawShape(wheelarchRB);
	car.drawShape(wheelarchLB);
	car.drawShape(wheelarchRT);
	car.drawShape(wheelarchLT);
	car.w = 166;
	car.h = 290;
	return car;
};
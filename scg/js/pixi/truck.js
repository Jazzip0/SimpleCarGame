function Truck(){
	SelfDrivingCar.call(this,90,206);
	this.speed = this.getSpeed(); 
	this.oldSpeed = this.speed;
	this.carGraphic = this.createTruckGraphic();
	var normalCarScalingX = this.w / this.carGraphic.w
	var normalCarScalingX = this.w / this.carGraphic.w
	this.carGraphic.scale.x = this.w / this.carGraphic.w;
	this.carGraphic.scale.y = this.h / this.carGraphic.h;
	this.carGraphic.pivot.x = 210;
	this.carGraphic.pivot.y = 496;
	this.carGraphic.rotation = Math.PI;
	this.addChild(this.carGraphic);
}

Truck.prototype = Object.create(SelfDrivingCar.prototype);

Truck.prototype.remove = function(other) {
	this.removeIndefinitely();
	host.pixi.addSelfDrivingCars(1);
};

Truck.prototype.createTruckGraphic = function() {
	var c = this.c;
	var frontBumper = new PIXI.Polygon([
		new PIXI.Point(16,10),
		new PIXI.Point(22, 4),
		new PIXI.Point(188, 4),
		new PIXI.Point(194, 10),
		new PIXI.Point(194, 30),
		new PIXI.Point(16, 30),]);

	var head = new PIXI.Polygon([
		new PIXI.Point(10,30),
		new PIXI.Point(30, 10),
		new PIXI.Point(180, 10),
		new PIXI.Point(200, 30),
		new PIXI.Point(200, 120),
		new PIXI.Point(10, 120),]);

	var windCatcher = new PIXI.Polygon([
		new PIXI.Point(0,110),
		new PIXI.Point(20, 70),
		new PIXI.Point(190, 70),
		new PIXI.Point(210, 110),]);

	var underCarry = new PIXI.Polygon([
		new PIXI.Point(30,120),
		new PIXI.Point(180, 120),
		new PIXI.Point(180, 130),
		new PIXI.Point(30, 130),]);

	var bed = new PIXI.Polygon([
		new PIXI.Point(0,130),
		new PIXI.Point(210, 130),
		new PIXI.Point(210, 490),
		new PIXI.Point(0, 490),]);

	var backBumper = new PIXI.Polygon([
		new PIXI.Point(0,490),
		new PIXI.Point(210, 490),
		new PIXI.Point(206, 496),
		new PIXI.Point(4, 496),]);



	var car = new PIXI.Graphics();
	car.beginFill(host.pixi.hsl2hex(c.h,c.s,(c.l - 75)));
	car.drawShape(frontBumper);
	car.drawShape(backBumper);
	car.drawShape(underCarry);
	car.endFill();
	car.beginFill(host.pixi.hsl2hex(c.h,c.s,c.l - 10));
	car.drawShape(head);
	car.endFill();
	car.beginFill(host.pixi.hsl2hex(c.h,c.s,c.l + 21));
	car.drawShape(windCatcher);
	car.drawShape(bed);
	car.endFill();
	
	car.w = 210;
	car.h = 496;
	return car;
};

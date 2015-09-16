function LifeCar(i,c){
	var w = 77;
	var h = 100;
	var row = host.pixi.players.length;
	Car.call(this,this.margin * 2 + (w / 2 + this.margin) * i, 0, w / 2,h / 2, c);
	this.carGraphic = this.createCarGraphic();
	this.carGraphic.scale.x = this.w / this.carGraphic.w;
	this.carGraphic.scale.y = this.h / this.carGraphic.h;
	this.addChild(this.carGraphic);
}
LifeCar.prototype = Object.create(Car.prototype);

LifeCar.prototype.remove = function(other) {
};

LifeCar.prototype.margin = 5;
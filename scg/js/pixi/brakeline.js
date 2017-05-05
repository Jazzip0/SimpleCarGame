function BrakeLine(car){
	PIXI.Container.call(this); //extend graphics pixi
	this.x = car.x;
	this.y = car.y;
	this.car = car;
	this.left = new PIXI.Graphics();
	this.left.beginFill('0xaaaaaa');
	this.left.drawRect(5,0,8,1);
	this.left.drawRect(car.w - 10,0,8,1);
	this.addChild(this.left);
	this.attached = true;
	host.pixi.brakeLineLayer.addChild(this);
	host.pixi.brakeLines.push(this);
}

BrakeLine.prototype = Object.create(PIXI.Container.prototype)

BrakeLine.prototype.MINSPEED = 1;

BrakeLine.prototype.update = function() {
	if(this.attached && !this.car.drag && this.car.brake){
		var length = Math.round(this.car.y - this.y);
		if(length > 0)
			this.left.height = length;
	}else
		this.attached = false;;

	this.y += this.MINSPEED;
	if(this.y > host.pixi.height)
		this.remove();

}

BrakeLine.prototype.remove = function() {
	var index = host.pixi.brakeLines.indexOf(this);
	if(index >= 0){
		host.pixi.brakeLines.splice(index,1);
		host.pixi.brakeLineLayer.removeChild(this);
	}
}

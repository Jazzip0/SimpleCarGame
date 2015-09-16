function SelfDrivingCar(w,h){
	//var w = w//69;
	//var h = h//108;
	this.SpawnOpp = w * h * 4;
	Car.call(this,Math.random() * (host.pixi.width - w - host.pixi.MARGIN * 2) + host.pixi.MARGIN,Math.random() * (-host.pixi.height * 2) - h,w,h,{h:Math.round(Math.random() * 255),s:Math.round(Math.random() * 254),l:(Math.round(Math.random() * 179) + 50)});
	this.speed = this.getSpeed(); 
	this.oldSpeed = this.speed;
	this.brake = false;
	this.drag = false;
	this.ACCEL = host.datVars.maxAcceleration;

}
SelfDrivingCar.prototype = Object.create(Car.prototype);

SelfDrivingCar.prototype.getSpeed = function(){
	return host.datVars.minSpeed + Math.random() * host.datVars.maxIncreasedSpeed;
}

SelfDrivingCar.prototype.ACCEL = 0.2;
SelfDrivingCar.prototype.MINSPEEDDIF = 1;
SelfDrivingCar.prototype.MINSPEED = 1;
SelfDrivingCar.prototype.BRAKINGDIST = 150;
SelfDrivingCar.prototype.MINDIST = 75;

SelfDrivingCar.prototype.display = function(){
	this.y += this.speed; 

	if (this.y > host.pixi.height) {
		this.remove();
	}
	this.collision();
	this.inSight();
}

SelfDrivingCar.prototype.inSight = function(){ //TODO more efficient
	if(this.smallestDist != -1 && this.smallestDist < this.BRAKINGDIST){
		if(!this.brake){
			this.addChild(this.brakeLights);
			this.brake = true;
			if(this.y > 0 && this.speed > this.voorliggerSpeed * 2) //create brakline when car has a speed twice as fast as voorligger
				var test = new BrakeLine(this);
		}
			var difSpeed = this.voorliggerSpeed - this.speed; //difference in speed between it and the verhicle ahead
			if(this.smallestDist > this.MINDIST){ //if car has a distance larger than the minimum distance between cars
				if(!this.drag){
					var absDifSpeed = Math.abs(difSpeed);
				if(absDifSpeed < this.ACCEL){ //if there is a smaller difference in speed than the maximum force 
					this.speed = this.voorliggerSpeed; //set speed to the same speed as verhicle ahead
					this.removeChild(this.brakeLights);
					this.drag = true;

				}else if(this.speed > this.MINSPEED)//when the differnce is larger than te maximum force
					this.speed += difSpeed / Math.abs(difSpeed) * this.ACCEL; //calculate weither the car should brake or accelerate to match the speed of the verhicle ahead
				}
			}else { //when the car is too close to the verhilce ahead break and has not deacce

				if(host.datVars.dodge && (this.smallestDistX_L == -1 || this.smallestDistX_R != -1 && -this.smallestDistX_L > this.smallestDistX_R && -this.smallestDistX_L > this.w * 1.5 ))
					this.x -= this.ACCEL * 10;
				else if(host.datVars.dodge && (this.smallestDistX_R > this.w * 1.5|| this.smallestDistX_R == -1))
					this.x += this.ACCEL * 10;
					else if(difSpeed < this.MINSPEEDDIF && this.speed > this.MINSPEED){ //accelerated enough to enlarge the
						if(this.drag){
							this.addChild(this.brakeLights);
							this.drag = false;
						}
						if(this.speed - this.ACCEL < this.MINSPEED)
							this.speed = this.MINSPEED
				else //Braking or steering
					this.speed -= this.speed / 10 + this.ACCEL;
			}

		}


	}else if(this.smallestDist > this.BRAKINGDIST || this.smallestDist == -1){
		if(this.brake){
			this.removeChild(this.brakeLights);
			this.brake = false;
			this.drag = false;
		}
		if(this.speed < this.oldSpeed){
			this.speed += this.ACCEL;
		}
	}
}

SelfDrivingCar.prototype.remove = function(other){
	if(host.pixi.addNonNormalCar()){ //chance on a adding a non "normal" car if no such car is added function returns false
		this.removeIndefinitely();
	host.pixi.updateCollisionCars();
}else{
	var spawningLengthNeeded = (this.SpawnOpp * host.pixi.amountOfCars) / host.pixi.width;
	this.y = - this.h - Math.random() * spawningLengthNeeded;
	this.x =  Math.random() * (host.pixi.width - this.w - host.pixi.MARGIN * 2) + host.pixi.MARGIN;
	this.speed = this.getSpeed(); 
	this.oldSpeed = this.speed;
}
}

SelfDrivingCar.prototype.removeIndefinitely = function(){
	var index = host.pixi.selfDrivingCars.indexOf(this);
	if(index >= 0){
		host.pixi.selfDrivingCars.splice(index,1);
		host.pixi.stage.removeChild(this);
	}

};
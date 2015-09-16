function Host(){
	var self = this;
	this.pixi = new Pixi();
	
	
	
	$("#title").fitText(.8);
	this.mobile = (/iphone|ipad|ipod|android|blackberry|mobile|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));
	this.seedRoom = new SeedRoom();
	this.socket = new Socket(this.seedRoom.seed); //TODO do I want this also on mobile devices?	
	if(!this.mobile){ //only for desctop
		this.setDatGui();
		this.setAnimation();
	}else{
		this.datVars = new this.getVariables();
		$('#linktoroom').css("display","none");
		$('#buttons').css("display","none");
	}
	$("#start").click(this.startGame);
}

Host.prototype.startGame = function() {
	host.pixi.started = true;
	$('#interface').css("display","none");
	host.pixi.players.forEach(function(player){
		player.lifesActivated = true;

	});	

	host.pixi.startFrame = host.pixi.frames; //start game by setting the time (game gets harder when the differnce between frames and startframe increases)
};
Host.prototype.setDatGui = function(first_argument) {
	this.datVars = new this.getVariables();
	var gui = new dat.GUI();
	gui.add(this.datVars,'amountOfCars',0,100).listen().onFinishChange(function(newValue){
		host.pixi.addSelfDrivingCars(Math.round(newValue) - host.pixi.amountOfCars); //add diverence of amount of cars to the screen
	});
	gui.add(this.datVars,'maxAcceleration',0,5).listen().onFinishChange(function(newValue){
		host.pixi.selfDrivingCars.forEach(function(car){
			console.debug(car.ACCEL);
			car.ACCEL = newValue;
		}); //add diverence of amount of cars to the screen
	});
	gui.add(this.datVars,'minSpeed',0,20);
	gui.add(this.datVars,'maxIncreasedSpeed',0,20);
	gui.add(this.datVars,'showInterface').onFinishChange(function(newValue){
		if(newValue)
			$('#interface').css("display","inline");
		else
			$('#interface').css("display","none");
	});
	gui.add(this.datVars,'dodge');


}

Host.prototype.getVariables = function() {
	this.amountOfCars = 25;
	this.showInterface = true;
	this.dodge = false;
	this.minSpeed = 4;//4
	this.maxIncreasedSpeed = 4; //4
	this.maxAcceleration = 0.2;
}

Host.prototype.setAnimation = function() {
	var elements = document.getElementsByClassName("baddplayer");
	var keyframes = [{top: $(window).height()},{top: 0}];
	var self = this;
	for(var i=0; i<elements.length; i++) {
		var anim = new Animation(elements[i],keyframes,{duration:700,delay:(100 *  i),easing:'cubic-bezier(0.660, 0.495, 0.670, 1.320)'});
		var player = document.timeline.play(anim);
		elements[i].addEventListener('click',this.addPlayer,false);
	}
};

Host.prototype.addPlayer = function(event){
	if(this.isAdded == undefined || !this.isAdded){
		this.pleasingColor = host.pixi.randomPleasingColor(255,155,10);
		this.hslPleasing = host.pixi.rgb2hsl(this.pleasingColor.r,this.pleasingColor.g,this.pleasingColor.b);
		this.pleasingColor = '#' + host.pixi.rgb2hex(this.pleasingColor.r,this.pleasingColor.g,this.pleasingColor.b).substring(2);
		event.path[1].style.background = this.pleasingColor;
		event.path[1].innerHTML ='<i class="fa fa-user"></i><paper-ripple class="circle recenteringTouch" fit></paper-ripple>';
	var buttons = event.path[5].childNodes[1].childNodes[2].childNodes; //TODO can this be done more efficient?
	this.left = buttons[1];
	this.right = buttons[3];
	this.left.childNodes[1].style.visibility = "visible" //set invisible element to visible
	this.right.childNodes[1].style.visibility = "visible" //set invisible element to visible
	var keyframes = [{opacity: 0,width:0,height:0},{opacity:1,width:'25px',height:'25px'}];
	var animL = new Animation(this.left.childNodes[1],keyframes,{duration:200,easing:'cubic-bezier(0.660, 0.495, 0.670, 1.320)'});
	var animR = new Animation(this.right.childNodes[1],keyframes,{duration:200,easing:'cubic-bezier(0.660, 0.495, 0.670, 1.320)'});
	this.left.childNodes[1].style.background = this.pleasingColor;
	this.right.childNodes[1].style.background = this.pleasingColor;
	var playerL = document.timeline.play(animL);
	var playerR = document.timeline.play(animR);
	this.id = Math.round(Math.random() * 100) + "";
	this.player = host.pixi.createPlayer(this.id,this.pleasingColor); //add new player
	var self = this;
	console.debug(this);
	$(self.right).click(function(){ //TODO copy function left
		if(self.selected == undefined || !self.selected){
			var touchHsl = {h:self.hslPleasing.h,s:self.hslPleasing.s,l:self.hslPleasing.l - 50};
			var hexTouch = '#' + host.pixi.hsl2hex(touchHsl.h,touchHsl.s,touchHsl.l).substring(2);
			self.right.childNodes[1].style.background = hexTouch;
			this.keyThingy = $(document).keydown(function(event){
				self.player.right = event.keyCode;
				var code = event.keyCode;
				if(code > 96 && code < 108)//fix for numpad //TODO correct fix
					code -= 48;
				self.right.childNodes[1].childNodes[1].innerHTML = host.correctChars(String.fromCharCode(code).toLowerCase());
			});
			self.selected = true;
			$(document).mousedown(function(){
				$(document).unbind("mousedown");
				$(document).unbind('keydown');
				self.right.childNodes[1].style.background = self.pleasingColor;
				self.selected = false;

			});
		}
	});

	$(self.left).click(function(){
		if(self.selected == undefined || !self.selected){
			var touchHsl = {h:self.hslPleasing.h,s:self.hslPleasing.s,l:self.hslPleasing.l - 50};
			var hexTouch = '#' + host.pixi.hsl2hex(touchHsl.h,touchHsl.s,touchHsl.l).substring(2);
			self.left.childNodes[1].style.background = hexTouch;
			this.keyThingy = $(document).keydown(function(event){
				self.player.left = event.keyCode;
				var code = event.keyCode;
				if(code > 96 && code < 108)//fix for numpad //TODO correct fix
					code -= 48;
				console.debug(code);
				
				self.left.childNodes[1].childNodes[1].innerHTML = host.correctChars(String.fromCharCode(code).toLowerCase());
			});
			self.selected = true;
			$(document).mousedown(function(){
				$(document).unbind("mousedown");
				$(document).unbind('keydown');
				self.left.childNodes[1].style.background = self.pleasingColor;
				self.selected = false;
				self.isAdded = false;

			});
		}
	});
	this.isAdded = true;
}else{
	host.pixi.removePlayer(this.id);
	this.left.childNodes[1].style.visibility = "hidden" //set invisible element to visible
	this.right.childNodes[1].style.visibility = "hidden" //set invisible element to visible
	self.left.childNodes[1].childNodes[1].innerHTML = '<i class="fa fa-arrow-circle-left"></i><paper-ripple class="circle recenteringTouch" fit></paper-ripple>';
	self.right.childNodes[1].childNodes[1].innerHTML = '<i class="fa fa-arrow-circle-right"></i><paper-ripple class="circle recenteringTouch" fit></paper-ripple>';
	event.path[1].innerHTML ='<i class="fa fa-user-plus"></i><paper-ripple class="circle recenteringTouch" fit></paper-ripple>';
	event.path[1].style.background= '#ff9b0a';
	this.isAdded = false;
}
}

Host.prototype.setPlayerButton = function(color,id) {
	$(".baddplayer").each(function(i, obj) {
		if(obj.id == id || obj.isAdded == undefined || !obj.isAdded){
			obj.isAdded = true;
			obj.id = id;
			this.pleasingColor = '#' + color.substring(2);
			$(obj).css("background-color",this.pleasingColor);
			$(obj).html('<i class="fa fa-gamepad"></i><paper-ripple class="circle recenteringTouch" fit></paper-ripple>');
			return false;
		}
	});
};
Host.prototype.removePlayerButton = function(id) {
	$(".baddplayer").each(function(i, obj) {
		if(obj.id == id){
			obj.isAdded = false;
			obj.id = undefined;
			$(obj).html('<i class="fa fa-user-plus"></i><paper-ripple class="circle recenteringTouch" fit></paper-ripple>');
			$(obj).css("background-color",'#ff9b0a');
			return false;
		}
	});
};


Host.prototype.correctChars = function(char) {
	if(char == '%')
		return '<i class="fa fa-arrow-circle-left"></i>'
	if(char == '&')
		return '<i class="fa fa-arrow-circle-up"></i>'
	if(char =='(')
		return '<i class="fa fa-arrow-circle-down"></i>'
		if(char =='\'')
			return '<i class="fa fa-arrow-circle-right"></i>'
		if(! /^[a-zA-Z0-9]+$/.test(char))
			return '<i class="fa fa-exclamation-circle"></i>'
		return char;
	};



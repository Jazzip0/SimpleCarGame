//generate a seed for the room and a qr code and link for the player
//http://davidshimjs.github.io/qrcodejs/
function SeedRoom(){

	this.seed = this.getSeed();
	this.link = "http://www.joepschyns.me/controller/controller.php?s=" + this.seed ;
	

	//set up content for user
	$('#seed').text(this.seed);
	$("#link").attr("href", this.link)
	this.createQR();
	
}

SeedRoom.prototype.createQR = function() {
	


	$.getJSON(
		"http://api.bitly.com/v3/shorten?callback=?", 
		{ 
			"format": "json",
			"apiKey": "R_eeceebf74ae64028a7dd8cb91daa4586",
			"login": "jazzip0",
			"longUrl": this.link
		},
		function(response)
		{
			if(response.status_txt == "OK"){
				$('#qrcode').html(""); //remove 
				var qrcode = new QRCode(document.getElementById('qrcode'), {
					text: response.data.url.substr(7),
					width: $('#linktoroom').height(),
					height: $('#linktoroom').height(),
					colorDark : "#000000",
					colorLight : "#ffffff",
					correctLevel : QRCode.CorrectLevel.H
				});
			}else
			console.log("couldn't create a short url");
		}
		);
};

SeedRoom.prototype.getCookie = function(){ //look for cookies and get saved seed
	var cookieCrumb = document.cookie.split("[\;\=]");
	console.debug(cookieCrumb);
	for(var i = 0; i < cookieCrumb.length;i++){
		if(cookieCrumb[i] == "rememberSeed"){
				return cookieCrumb[i + 1];//return previous seed
			}
		}
		return false; //no room was created in this browser before
	}
	SeedRoom.prototype.getSeed = function(){
		var oldSeed = this.getCookie();
		console.debug(oldSeed);
	if(oldSeed == false || oldSeed == 'undefined'){ //no cookie has been created before create new seed
		this.seed = Math.round(Math.random()+'e4');
		 document.cookie = 'rememberSeed=' + this.seed; //create cookie
		 return this.seed;
		}else
		return this.seed = oldSeed; console.debug(oldSeed);
	}
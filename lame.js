var interval; //Dunno, for some reason I wanted to declare an empty variable...

$(document).ready(function(){
	///////////////////////////////INITIAL SETUP://///////////////////////////////////////

	function musicStart(){
		musicLoop = document.getElementById('musicLoop');
		musicLoop.play();
		musicInterval = setInterval(function(){
			musicLoop.currentTime = 0;
			musicLoop.play();
		},28803);
	}
	
	initMusic = setInterval(function(){
		musicStart();
		clearInterval(initMusic);
	},500);
	

	musicMute = false;
	soundMute = false;
	

	mX = $('#sliderBar').css('marginLeft');
	console.log(mX);
	$('#nojs').toggleClass('hidden'); //Hide the "js not enabled" message
	targetTime = 900;				  //Time (in ms) it takes to generate a new target - 900 is ideal
    targetTime2 = targetTime - 100;    //Time it takes to remove a generated target - has to be slightly less than the above
    zoneMin = 0;					  //This and the following 4 are default variables - their values change during gameplay
	zoneMax = 0;					  //...	
	zoneHeight = 0;					  //...
	score = 0;
	globalTime = 100;						  //...
	gameTime = globalTime;					  //Default = 100
	enemyTotal = 0;
	enemyKill = 0;
	friendTotal = 0;
	friendKill = 0;
	targetsTotal = 0;
	targetWidth = 100;
	autoKillEnemy = false;
	autoKillFriend = false;
	developer = false;
	cheatCounter = 0;
	$('#autokill').toggleClass('hidden');

	$('#preview').css({
		width: targetWidth,
		height: 'auto',
	});

	$('#postGame').toggleClass('hidden');	//Hide post-game screen
	$('#countdown').toggleClass('hidden');
	$('.blink').each(function() {
	    var elem = $(this);
	    
	    blinkInterval = setInterval(function() {
	        if (elem.css('visibility') == 'hidden') {
	            elem.css('visibility', 'visible');
	        } else {
	            elem.css('visibility', 'hidden');
	        }    
	    }, 500);
	}); //Makes anything with the class .blink blink

	gameState = 'mainmenu';					//Initial game state
	playerState = 'ready';					//Initial player state; 'ready' means you can fire, 'reloading' means you have to wait
	$('#playgame').toggleClass('hidden');	//The following are elements that are hidden in the main menu
	$('#player').toggleClass('hidden');		//...
	$('#enemy').toggleClass('hidden');		//...
	$('#friend').toggleClass('hidden');		//...
	$('#bullet').toggleClass('hidden');		//...
	

	////////////////////////////FUNCTIONS AND EVENTS:////////////////////////////////////////

	mouseIsDown = false;
	$('#sliderBar').mousedown(function(e){
		mouseIsDown = true;
		mX = e.pageX;
	});
	$('body').mouseup(function(f){
		mouseIsDown = false;
	});

	$('#muteMusic').mousedown(function(){
		if(musicMute == false){
			musicMute = true;
			musicLoop.pause();
			musicLoop.currentTime = 0;
			clearInterval(musicInterval);
			$('#muteMusic').empty();
			$('#muteMusic').append('Music: OFF');
		} else {
			musicMute = false;
			musicLoop.play();
			musicStart();
			$('#muteMusic').empty();
			$('#muteMusic').append('Music: ON');
		}
	});

	$('#muteSound').mousedown(function(){
		if(soundMute == false){
			soundMute = true;
			$('#muteSound').empty();
			$('#muteSound').append('Sound: OFF');
		} else {
			soundMute = false;
			$('#muteSound').empty();
			$('#muteSound').append('Sound: ON');
		}
	});

			
	$('body').mousemove(function(e){
			if(e.pageX < mX && mouseIsDown == true && parseInt($('#sliderBar').css('marginLeft'),10) > -210){
				barCSSPos = parseInt($('#sliderBar').css('marginLeft'),10) - 1;

				barPos2 = barCSSPos;
				$('#sliderBar').css({marginLeft: barPos2,});
				changeWidth(barPos2);
				
				mX = e.pageX;
			} else if(e.pageX > mX && mouseIsDown == true && parseInt($('#sliderBar').css('marginLeft'),10) < -22){
				barCSSPos = parseInt($('#sliderBar').css('marginLeft'),10) + 1;

				barPos2 = barCSSPos;
				$('#sliderBar').css({marginLeft: barPos2,});
				changeWidth(barPos2);
				
				mX = e.pageX;
			}
	});

	function changeWidth(pos){
		targetWidth = ((pos*-1+(-22))*-0.3)+120;
		$('#preview').css({
			width: targetWidth,
			height: 'auto',
		});
		$('#enemyPic').css({
			width: targetWidth,
			height: 'auto',
		});
		$('#friendPic').css({
			width: targetWidth,
			height: 'auto',
		});
	}

	function playSound(soundID){
		document.getElementById(soundID).play();
	}

	function gameTimer(){ //This function handles the countdown before game over
		$('#countdown').toggleClass('hidden'); //Unhides the onscreen counter
		gameInterval = setInterval(function(){ //Subtracts 1 from remaining game time every second and updates the onscreen counter
			gameTime = gameTime - 1;
			$('#countdown').empty();
			$('#countdown').append(gameTime + ' seconds left');
			if(gameTime <= 0){				   //When timer reaches 0, the postGame function on line 53 is called
				postGame();
				clearInterval(gameInterval);
			}
		}, 1000);
	} 

	function postGame(){ //Post game screen (game over)
		gameState = 'postgame';
		 //This and following lines hides and unhides certain elements
		clearInterval(targetInterval);			//Except this one..
		clearInterval(enemyInterval);
		clearInterval(friendInterval);
		if($('#enemy').hasClass('hidden') == true){
			//nothing
		} else {$('#enemy').toggleClass('hidden');}		//...
		if($('#friend').hasClass('hidden') == true){
			//nothing
		} else {$('#friend').toggleClass('hidden');}		//...
		if($('#player').hasClass('hidden') == true){
			//nothing
		} else {$('#player').toggleClass('hidden');}		//...
		if($('#bullet').hasClass('hidden') == true){
			//nothing
		} else {$('#bullet').toggleClass('hidden');}		//...
		if($('#postGame').hasClass('hidden') == false){
			//Do nothing
		} else {$('#postGame').toggleClass('hidden');}	//...
		if($('#playgame').hasClass('hidden') == true){
			//Do nothing
		} else {$('#playgame').toggleClass('hidden');}
		if($('#score').hasClass('hidden') == true){
			//Do nothing
		} else {$('#score').toggleClass('hidden');}		//...
		if($('#countdown').hasClass('hidden') == true){
			//Do nothing
		} else {$('#countdown').toggleClass('hidden');}	//...

		if($('#enemy').hasClass('hidden2') == false){
			$('#enemy').toggleClass('hidden2');
		}
		if($('#friend').hasClass('hidden2') == false){
			$('#friend').toggleClass('hidden2');
		}

		$('#finalScore').empty();											////
		$('#finalScore').append('<strong>Final score:</strong> ' + score);  //Display final score

		if(score <= 0){	//The following are different messages displayed for 0 or negative scores, determined by certain limits
			if(score <= -160){
				verdict = 'Wow!! Either you completely misunderstood the objective, or you completely suck!!!';
			} else if(score <= -70){
				verdict = 'You suck!';
			} else if(score <= -30){
				verdict = 'We are not amused :-(';
			} else {
				verdict = 'Better luck next time!';
			} 
		}
		if(score >= 1){ //The following are the same, but for positive scores
			if(score >= 900){
				verdict = 'You...are...a...GOD!!!!! :-O';
			} else if(score >= 600){
				verdict = 'You rock!!!';
			} else if(score >= 400){
				verdict = 'Pretty good :-)';
			} else if(score >= 250){
				verdict = 'OK, I guess...';
			} else {
				verdict = 'Pffft.. A child could do that...';
			}
		}
		$('#conclusion').empty();											////
		$('#conclusion').append('<strong>Verdict:</strong> ' + verdict);	//Displays the message determined above

		$(window).keypress(function(e) { //Refreshes the site when space is pressed
			if (e.keyCode == 0 || e.keyCode == 32 && gameState == 'postgame') {
				barPo = $('#sliderBar').css('marginLeft');
				resetGame(barPo,targetWidth);
			}
		}); 
	} 

	function targetTimer(){ //Generates targets (Barbara or cat) at a predetermined time interval
		targetInterval = setInterval(function(){
			targetType = Math.floor((Math.random() * 3) + 0);	//Randomly picks 0 or 1 every time the interval restarts
			console.log(targetType);
			if(targetType >= 1){								//Picks target type based on the generated number
				createEnemy();									//Line 183
			} else {createFriend();}							//Line 201
		}, targetTime);											//targetTime is per default 900 (ms) as defined in initial setup
	}

	function playGame(){ //Hides main menu and unhides the game; starts the game
//		console.log('Game started...');
		gameState = 'playgame';					//Change gamestate, so the event listener on line 116 is disabled
		$('#mainmenu').toggleClass('hidden');
		$('#playgame').toggleClass('hidden');
		$('#player').toggleClass('hidden');
		$('#score').empty();
		$('#score').append('Score: 0');			//Displays initial score onscreen
		if($('#score').hasClass('hidden') == true){
			$('#score').toggleClass('hidden');
		}
		$('#countdown').empty();
		$('#countdown').append('100 seconds left');
		if($('#enemy').hasClass('hidden2') == true){
			$('#enemy').toggleClass('hidden2');
		}
		if($('#friend').hasClass('hidden2') == true){
			$('#friend').toggleClass('hidden2');
		}
	} 

	$(window).keypress(function(e) {			//Run following code if a key is pressed:
		if (e.keyCode == 0 || e.keyCode == 32 && gameState == 'mainmenu') { //Only run the code if that key is space AND the gamestate is mainmenu
			playGame(); //Line 107 (start the game)
			targetTimer(); //Line 98 (start target generation)
			gameTimer(); //Line 40
			if(soundMute == false){
				playSound('laugh');
			}
		}
	}); 

	$('body').keydown(function(e){
		if(e.keyCode == 84 && developer == false && cheatCounter < 20){
			// user pressed T
			cheatCounter = cheatCounter + 1;
		} else if (e.keyCode == 84 && developer == false) {cheatCounter = 0;}
		if(e.keyCode == 89 && developer == false && cheatCounter == 19){
			// user pressed Y
			playSound('dog');
			cheatCounter = 0;
			developer = true;
			$('#autokill').toggleClass('hidden');
			autoKillSwitch('friend');
		} else if(e.keyCode != 84 && e.keyCode != 89) {cheatCounter = 0;}
	});

	$('body').keydown(function(e){
	   if(e.keyCode == 84 && developer == true){
	       // user has pressed T
	       autoKillSwitch('enemy');
	   }
	   if(e.keyCode == 89 && developer == true){
	       // user has pressed Y
	       autoKillSwitch('friend');
	   }
	});

	function autoKillSwitch(targetID){
		if(targetID == 'enemy'){
			if(autoKillEnemy == false){
				autoKillEnemy = true;
				$('#autoKillEnemy').empty();
				$('#autoKillEnemy').append('Enemies (T): ON');
			} else {
				autoKillEnemy = false;
				$('#autoKillEnemy').empty();
				$('#autoKillEnemy').append('Enemies (T): OFF');
			}
		}
		if(targetID == 'friend'){
			if(autoKillFriend == false){
				autoKillFriend = true;
				$('#autoKillFriend').empty();
				$('#autoKillFriend').append('Friends (Y): ON');
			} else {
				autoKillFriend = false;
				$('#autoKillFriend').empty();
				$('#autoKillFriend').append('Friends (Y): OFF');
			}
		}
	}

	$('#playgame').on('mousemove', function(e){	//Run following when the mouse moves on #playgame (game window):
    	$('#player').css({left:  e.pageX,});	//Gives the player same horizontal position as the mouse
	}); //Player follows mouse on x-axis, inside stage


//	function projectile(position){
//		console.log('Shot fired from ' + position);
//	}

	function bulletTimer(startPos){ //Function that handles the movement of the bullet - gets startPos from function line 166
		position = startPos - 153;	//Horizontal starting position, corrected
		posY = 441;					//Vertical starting position - same as player
		if($('#bullet').hasClass('hidden') == true){
			$('#bullet').toggleClass('hidden');
		} else {
			 //Do nothing
		}
		bulletHeight = 30;					//Bullet pixel height
		$('#bullet').css({height: bulletHeight,}); //Sets forementioned pixel height
		if(soundMute == false){
			playSound('laser');
		}
		bulletInterval = setInterval(function(){   //Interval for the bullet's 'flight'
			$('#bullet').css({ //Redefines these CSS values every ms
				marginLeft: position,
				top: posY,
				zIndex: -1,
			});
//			console.log(posY);

			if(posY <= zoneHeight + 80 && startPos > zoneMin && startPos < zoneMax && gameState == 'playgame'){
				$('#bullet').toggleClass('hidden');
				$('#bullet').css({top: 0});
				destroyTarget();
				clearInterval(bulletInterval);
			}

			if(posY <= 70){
				$('#bullet').toggleClass('hidden');
				$('#bullet').css({top: 0});
				clearInterval(bulletInterval);
				
			}

			posY = posY - 4; //Subtracts 4 pixels from the bullet's vertical position every ms, so it moves 4 px every interval
		}, 1);
		bulletInterval;
	}

	function fire(){
		var position = $('#player').position();
//    		projectile(position.left);
    		bulletTimer(position.left); //Line 133




    		console.log('Reloading...');
    		playerState = 'reloading';
    		interval = setInterval(function() {
    			console.log('Reloaded!');
    			playerState = 'ready';
    			clearInterval(interval);
    		}, 500);
    		interval;
	} //Get player position, fire shot, initiate reload-interval


	function createEnemy(){
		if(targetsTotal <= 110){
			if($('#enemy').hasClass('hidden')){$('#enemy').toggleClass('hidden');}
		
	//		$( "#enemy" ).removeAttr( "style" ).hide();
			enemyPos = Math.floor((Math.random() * 450) + 150);
			marginPos = Math.floor((Math.random() * 100) + 0);
	
			$('#enemy').css({left: enemyPos});
			$('#enemy').css({marginTop: marginPos});
	
			targetCounter('enemy',false);
			setScore();
	
			zoneMin = enemyPos;
			zoneMax = enemyPos + targetWidth;
			zoneHeight = marginPos + targetWidth;
	
			if(autoKillEnemy == true){
				enemyKillInterval = setInterval(function(){
					destroyTarget();
					clearInterval(enemyKillInterval);
				},300);
				
			}
	
			enemyInterval = setInterval(function(){
				zoneMin = 0;
				zoneMax = 0;
				$('#enemy').toggleClass('hidden');
				clearInterval(enemyInterval);
			}, targetTime2);
		}
	}

	function createFriend(){
		if(targetsTotal <= 110){
			$('#friend').toggleClass('hidden');
			friendPos = Math.floor((Math.random() * 450) + 150);
			marginPos = Math.floor((Math.random() * 100) + 0);
	
			$('#friend').css({left: friendPos});
			$('#friend').css({marginTop: marginPos});
	
			targetCounter('friend',false);
			setScore();
	
			zoneMin = friendPos;
			zoneMax = friendPos + targetWidth;
			zoneHeight = marginPos + (targetWidth);
	
			if(autoKillFriend == true){
				friendKillInterval = setInterval(function(){
					destroyTarget();
					clearInterval(friendKillInterval);
				},300);
				
			}
	
			friendInterval = setInterval(function(){
				zoneMin = 0;
				zoneMax = 0;
				$('#friend').toggleClass('hidden');
				clearInterval(friendInterval);
			}, targetTime2);
		}
	}

	function setScore(){
		
		enemyRel = (enemyTotal+1)/(targetsTotal+1);
		friendRel = (friendTotal+1)/(targetsTotal+1);
		scoreRaw = (enemyKill/enemyRel)-(friendKill/friendRel);
		scoreBase = (scoreRaw/110)*1000;	
	//	scoreRaw = Math.ceil( (((enemyKill+1)*((enemyKill+1)/(enemyTotal+1))) - (((friendKill+1)*((friendKill+1)/(1+friendTotal)))*1.5))*15 );
		score = Math.ceil((scoreBase/(targetWidth/10)*4.4));

		if(friendKill == 0){
			score = score*2;
		}

		console.log('enemy total: ' + targetsTotal);
	//	if(friendKill == 0){
	//		score = score * 2;
	//	} else if(friendKill >= 3){
	//		score = score * 0.5;
	//	}
		if(isNaN(score) == true){
			score = 0;
		}
		$('#score').empty();
		$('#score').append('Score: ' + score);
	}


	function destroyTarget(){
		if(targetType >= 1){
			console.log('Enemy destroyed!');
			if(soundMute == false){
				playSound('dog');
			}

			zoneMin = 0;
			zoneMax = 0;
			
			$("#enemyPic").attr("src","enemyHit.png");
			$('#enemy').effect("pulsate",{times: 10});
			setTimeout(function() {$('#enemy').toggleClass('hidden');$("#enemyPic").attr("src","enemy.png");}, 100 );
			
			targetCounter('enemy',true);
			setScore();
			clearInterval(enemyInterval);
			clearInterval(targetInterval);
			targetTimer();
		} else {
			console.log('Friend destroyed!');
			if(soundMute == false){
				playSound('cat');
			}

			zoneMin = 0;
			zoneMax = 0;

			$("#friendPic").attr("src","friendHit.png");
			$('#friend').effect("pulsate",{times: 10});
			setTimeout(function() {$('#friend').toggleClass('hidden');$("#friendPic").attr("src","friend.png");}, 100 );

			targetCounter('friend',true);
			setScore();
			clearInterval(friendInterval);
			clearInterval(targetInterval);
			targetTimer();
		}
	}

	function targetCounter(type,kill){
		if(type == 'enemy' && kill == false){
			enemyTotal = enemyTotal + 1;
		} if (type == 'enemy' && kill == true) {
			enemyKill = enemyKill + 1;
		}
		if(type == 'friend' && kill == false){
			friendTotal = friendTotal + 1;
		} if (type == 'friend' && kill == true) {
			friendKill = friendKill + 1;
		}
		targetsTotal = enemyTotal + friendTotal;
		killTotal = enemyKill + friendKill;
	}
	

	$(window).mousedown(function(){
		if(gameState == 'playgame' && playerState == 'ready'){
			fire();	
		//	$.playSound('laser');
    	}
    }); //Starts fire function on mouseclick

    function resetGame(barPos,targetW){
    	if($('#nojs').hasClass('hidden') == true){
    		//Nothing
    	} else {$('#nojs').toggleClass('hidden');} //Hide the "js not enabled" message
		score = 0;						  //...
		gameTime = globalTime;					  //...
		enemyTotal = 0;
		enemyKill = 0;
		friendTotal = 0;
		friendKill = 0;
		targetsTotal = 0;
		barP = parseInt(barPos,10);
		$('#sliderBar').css({marginLeft: barP,});
		$('#preview').css({
			width: targetW,
			height: 'auto',
		});
		$('#enemyPic').css({
			width: targetW,
			height: 'auto',
		});
		$('#friendPic').css({
			width: targetW,
			height: 'auto',
		});
	
		$('#postGame').toggleClass('hidden');	//Hide post-game screen
		if($('#countdown').hasClass('hidden') == true){
			//Nothing
		} else {$('#countdown').toggleClass('hidden');}
	
		gameState = 'mainmenu';					//Initial game state
		playerState = 'ready';					//Initial player state; 'ready' means you can fire, 'reloading' means you have to wait
		if($('#playgame').hasClass('hidden') == true){
			//Nothing
		} else {$('#playgame').toggleClass('hidden');}	//The following are elements that are hidden in the main menu
		if($('#player').hasClass('hidden') == true){
			//Nothing
		} else {$('#player').toggleClass('hidden');}
		if($('#enemy').hasClass('hidden') == true){
			//Nothing
		} else {$('#enemy').toggleClass('hidden');}
		if($('#friend').hasClass('hidden') == true){
			//Nothing
		} else {$('#friend').toggleClass('hidden');}
		if($('#bullet').hasClass('hidden') == true){
			//Nothing
		} else {$('#bullet').toggleClass('hidden');}
		if($('#mainmenu').hasClass('hidden') == true){
			$('#mainmenu').toggleClass('hidden');
		}
    }

});
//creating  canvas variable and canvas context variable
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//declaring and initializing coordinate variables that will keep track of mouse location
//created as global variables so they can be used by multiple functions
var x = 0;
var y = 0;

//creating arrays for keeping track of div element addresses brushes/colors/Bgcolors
var brushArray = [document.getElementById('brushSquare'),
				  document.getElementById('brushCircle'),
				  document.getElementById('brushDiag'),
				  document.getElementById('brushEraser')];
var colorArray = [document.getElementById('colorBlack'),
				  document.getElementById('colorRed'),
				  document.getElementById('colorBlue'),
				  document.getElementById('colorYellow'),
				  document.getElementById('colorGreen'),
				  document.getElementById('colorPurple'),
				  document.getElementById('colorWhite'),
				  document.getElementById('colorBrown')];
var bgColorArray = [document.getElementById('bgColorBlack'),
					document.getElementById('bgColorRed'),
					document.getElementById('bgColorBlue'),
					document.getElementById('bgColorYellow'),
					document.getElementById('bgColorGreen'),
					document.getElementById('bgColorPurple'),
					document.getElementById('bgColorWhite'),
					document.getElementById('bgColorBrown')];

//setting initial brush selected to square brush and declaring drawTimer global variable
//so it can be accessed by numerous methods
var brSelector = "square";
var drawTimer;


//setting initial selection
brushArray[0].style.border = "3px solid #00FF00";
colorArray[0].style.border = "3px solid #00FF00";
bgColorArray[6].style.border = "3px solid #00FF00";

//adding event listeners
//startdraw begins interval timer that draws shapes in selected color as long as button remains depressed
//stopdraw clears the interval timer that was drawing things as soon as mouse button is released
//updateCoords keeps track of mouse coordinates whenever mouse is moved
document.addEventListener("mousedown", startDraw);
document.addEventListener("mouseup", stopDraw);
document.addEventListener("mousemove", updateCoords);

//resets brush selection to none, then changes border color to green to display new selection
//updates brush selector variable for use in other painting functions
//for square, circle or diag brushes it uses source-over to paint over old drawings
//for eraser, it uses destination out in order to erase old drawings
//passed x value is array number corresponding to color selection
function brushSelect(x){
	resetSelection(4, 'brush');
	brushArray[x].style.border = "3px solid #00FF00";
	if(x === 0){
		brSelector = "square";
		ctx.globalCompositeOperation = "source-over";
	}
	else if(x === 1){
		brSelector = "circle";
		ctx.globalCompositeOperation = "source-over";
	}
	else if(x === 2){
		brSelector = "diag";
		ctx.globalCompositeOperation = "source-over";
	}
	else if(x === 3){
		brSelector = "eraser";
		ctx.globalCompositeOperation = "destination-out";
	}
}

//resets color selection to none, then changes border color to green to display new selection
//changes fill style and stroke style to new color for drawing on canvas
//passed x value is array number corresponding to color selection
function colorSelect(x){
	resetSelection(8, 'color');
	colorArray[x].style.border = "3px solid #00FF00";
	//extracting proper values from colorArray for use in fillstyle and strokestyle
	paintColor = window.getComputedStyle(colorArray[x], null).getPropertyValue("background-color");
	ctx.fillStyle = paintColor;
	ctx.strokeStyle = paintColor;
}

//resets bg color selection to none, then changes border color to green to display new selection
//changes canvas bgcolor to new value
//passed x value is array number corresponding to bg color selection
function bgColorSelect(x){
	resetSelection(8, 'bgColor');
	bgColorArray[x].style.border = "3px solid #00FF00";
	//extracting proper values from bgcolorarray for use in setting new bg color
	bgColor = window.getComputedStyle(bgColorArray[x], null).getPropertyValue("background-color");
	canvas.style.backgroundColor = bgColor;
}

//resets selection before new selection is made
//k is the length of the array, h is array type
function resetSelection(k, h){
	if(h === 'brush'){
		for(var t = 0; t < k; t = t + 1){
			brushArray[t].style.border = "3px solid black";
		}
	}
	else if(h === 'color'){
		for(var t = 0; t < k; t = t + 1){
			colorArray[t].style.border = "3px solid black";
		}
	}
	else if(h === 'bgColor'){
		for(var t = 0; t < k; t = t + 1){
			bgColorArray[t].style.border = "3px solid black";
		}
	}
}

//function that run everytime the mouse is moved (via event listener), keeps track of current mouse X and
//Y coordinates for use in other functions
function updateCoords(e){
	x = e.clientX - 19;
	y = e.clientY - 19;
}

//function that runs whenever mouse button is depressed (via event listener), sets interval for painting
//shapes ever .001 millisecond so that the current shape is drawn at X Y coordinates repeatedly to make
//a smooth line
function startDraw(e){
drawTimer = setInterval(paintLine, 0.001);
}

//function that uses brSelector variable to determine which shape to paint on the canvas, is
//repeated by the startDraw(e) function that sets an interval using this method
function paintLine(){
	//if square brush is selected, make 5px X 5px square at the current
	//mouse location specified by X Y coordinates
	if(brSelector === "square"){
		ctx.beginPath();
		ctx.fillRect(x,y,5,5);
	}
	
	//if circle brush is selected, make a solid 2.5px radius circle
	//ar current mouse location specified by X Y coordinates
	else if(brSelector === "circle" || brSelector === "eraser"){
		ctx.beginPath();
		ctx.arc(x, y, 2.5, 0, 2 * Math.PI);
		ctx.fill();
	}

	//if diagonal brush is selected, make a diagonal px line between
	//coordinates x-2.5,y+2.5  and x+2.5, y-2.5, at current mouse location X Y
	else if(brSelector === "diag"){
		ctx.beginPath();
		ctx.moveTo(x-2.5,y+2.5);
		ctx.lineTo(x+2.5,y-2.5);
		ctx.stroke();
	}

}

//function called when the event listener notices that the left mouse button is released
//clears the painting interval, stops shapes from being drawn at mouse location on canvas
function stopDraw(e){
	clearInterval(drawTimer);
}
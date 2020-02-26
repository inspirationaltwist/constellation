//  globals
 var allPoints;
 var showLetters = true;



// all divs in body
let allDivs = document.body.getElementsByTagName('div');

$(function() {
	addButtons();	

	getPoints().then((pointsArr) => {
		allPoints = pointsArr;
		createPaths(pointsArr);	
		$('#wrapper').append('<h4>Press ENTER to toggle</h4>')
		toggleElmt('#wrapper');
		toggleElmt('button');

		createCanvas().then((ctx) => {
				ctx.beginPath();
				
				plotPoints(ctx, pointsArr);

				setPaths($('.startPoint'), ctx, pointsArr);
				setPaths($('.endPoints'), ctx, pointsArr);

				console.log(`allPoints: ${JSON.stringify(allPoints)}`);
			
			hidePoints(); // hide original DOM points
			
			// clear canvas & replot points (erase all paths)
			clearCanvasBtnListener(ctx).then(() => {
				console.log('replot now');
				ctx.fillRect(1000,1000,4,4);
				// ctx.beginPath();			
				// plotPoints(ctx, allPoints);
				replotPointsBtnListener(ctx);
			});
		})
		// replotPointsBtnListener(ctx);
	})


    // getPoints().then((points) => {
    // 	allPoints = points;
    // 	console.log(`allPoints: ${JSON.stringify(allPoints)}`);
    // });
});

// return array of point objects from DOM
// [{id: "b", top: "100", left: "100"}, 
function getPoints() {
	let dfd = jQuery.Deferred();

	let points = [];
	
	$("div").each(function(index) {
		let point = {};	
		let txt = $(this).text();
		let id = $(this).attr('class');
		let pos = getPositionXY($(this));
		if (txt === "•") {
			console.log(`point ID: ${id}, pos: ${JSON.stringify(pos)}`);
			point['id'] = id;
			point['pos'] = pos;
			points.push(point);
		}
	});

	dfd.resolve(points);

	if (points.length === 0) {
		console.log('points not retrieved');
	}
	return dfd.promise();
}

// hide original points from DOC
function hidePoints() {
	$('.a').addClass('hide');
}


// plot points on HTML canvas
function plotPoints(ctx, pointsArr) {
	let currentIndex;
	// getPoints().then((pointsArr) => {
		// getPos("b", pointsArr, null);
		console.log(`plotPoints length: ${pointsArr.length}`);

		// console.log(`getPointById: ${JSON.stringify(getPointById("f", pointsArr))}`);

		for (var i = 0; i < pointsArr.length; i++) {
			// let startPos = points[i]['pos'];	

			// let endPos = pointsArr[3]['pos'];
			let point = pointsArr[i];
			let id = point['id'];
			let left = point['pos']['left'];
			let top = point['pos']['top'];

			ctx.fillRect(left,top,4,4); // (x, y, width, height)	


			toggleLetters(ctx, id, left, top);
			// showLetters2(ctx, id, left, top);
				
		// if ( typeof showLetters == 'function' ) { 
		// 	if (showLetters) {
		// 		showLetters(ctx, id, left, top)
		// 	}
		// }
					
			// ctx.moveTo(top, left);
			// ctx.lineTo(20, 20);
			// ctx.stroke(); 		

			// working		
			// drawLine(ctx, left, top, 20,20);
		}

		// connectTwoPoints('b', 'c', ctx, pointsArr);
		// connectTwoPoints('e', 'f', ctx, pointsArr);
		// connectTwoPoints('b', 'd', ctx, pointsArr);

		// connectMultiplePoints('b', ['c', 'd', 'e'], ctx, pointsArr)

		// eraseLines(ctx);
		// drawLine(ctx, 100, 100, 750, 500.00001525878906);
	// })

	// clear();
}

// draw line connecting two points by letter ids
function connectTwoPoints(id1, id2, ctx, pointsArr) {
	let p1 = getPointById(id1, pointsArr)[0];
	let p2 = getPointById(id2, pointsArr)[0];

	console.log(`p1: ${JSON.stringify(p1)}`)

	let p1_pos = p1['pos'];
	// let p1_pos = p1['pos'];
	let p2_pos = p2['pos'];

	console.log(`connectPoints: (${p1_pos['left']}, ${p1_pos['top']}) -> (${p2_pos['left']}, ${p2_pos['top']})`);

	drawLine(ctx, p1_pos['left'], p1_pos['top'], p2_pos['left'], p2_pos['top']);
} 

// draw lines from start point to end points
function connectMultiplePoints(id1, idsArr, ctx, pointsArr) {
	for (var i=0; i < idsArr.length; i++) {
		connectTwoPoints(id1, idsArr[i], ctx, pointsArr);
	}
}

// draw line from start coord to end coord
function drawLine(ctx, startLeft, startTop, endLeft, endTop) {
	// {"top":100,"left":100}
	// console.log(`drawLine: ${JSON.stringify(startPos)}`);
	// console.log(`drawLine: ${startPos.top}`);
	ctx.moveTo(startLeft, startTop);
	ctx.lineTo(endLeft, endTop);
	ctx.stroke(); 	
}

// getPoints() : 
// [
// {"id":"b","pos":{"top":100,"left":100}},
// {"id":"c","pos":{"top":500.00001525878906,"left":750}},
// {"id":"d","pos":{"top":30,"left":35}},
// {"id":"e","pos":{"top":50,"left":75}},
// {"id":"f","pos":{"top":50,"left":50}}]

// function get position (left / top) of point by letter name
// function getPos(points, id, dir) {
// 	let pos;
// 	console.log(`getPos`);
// 	// getPoints().then((points) => {

// 		for (var i = 0; i < points.length; i++) {
// 			let point = points[i];
// 			console.log(`getPos point id: ${point['id']}`);
// 			if (point['id'] === id) {
// 				pos = point.pos;
// 			} else {
// 				console.log('getPos failed')
// 			}
// 		}
// 	// })
// 	console.log(`getPos: ${pos}`);
// 	return pos;
// }

// get the position of a point
function getPos(id, pointsArr, dir) {
	return getPointById(id, pointsArr)[dir];
}

// filter array of point objects by id
// return point object with matching id
function getPointById(id, pointsArr) {
	var filtered = pointsArr.filter(function(point){
	    return point.id.toLowerCase() == id.toLowerCase();
	});

	return filtered;

	// let resArr = [];

	// for (var i = 0; i < pointsArr.length; i++) {
	//     if (pointsArr[i].id == id) {
	//         resArr.push(pointsArr[i]);
	//         console.log('point added');
	//     }		
	// }

	// return resArr[0];
}

// USER INTERFACE
function appendInput() {
	// let label1 = '<label for="startPoint">Start point</label>';
	let input1 = '<input type="text" id="startPoint" placeholder="start point" value=""><br/>';

	// let label2 = '<label for="endPoint">End points</label>';
	let input2 = '<input type="text" id="endPoints" placeholder="end points" value="">';
	
	// $('body').append(label1);
	$('body').append(input2);

	// $('body').append(label2);
	$('body').append(input1);
}

// array of html elmts (inputs) to append to DOM
function addButtons() {
	let btns = [];

	let clearCanvasBtn = '<button id="clearCanvasBtn" class="show-inline" value="">Clear Canvas</button>'
	let replotPointsBtn = '<button id="replotPointsBtn" class="show-inline" value="">Replot Points</button>'

	btns.push(clearCanvasBtn, replotPointsBtn);

	for (var i=0; i < btns.length; i++) {
		$('body').append(btns[i]);
	}
}

function createPaths(pointsArr) {
	$('#wrapper').append('<h4>Hit "Enter" key to toggle</h4>');
	for (var i=0; i < pointsArr.length; i++) {
		newPath(pointsArr[i]['id']);
	}		
}

//  create startpoint or endpoints input
function newPath(startId) {
	
	let input1 = `<input type="text" class="startPoint" placeholder="start point" value=${startId.toUpperCase()}> &nbsp;&nbsp; -> &nbsp;&nbsp; `;
	let input2 = `<input type="text" class="endPoints" placeholder="end points" value=''><br/>`;
	$('body').append('<div id="wrapper" class="show"></div>');
	$('#wrapper').append(input1);
	$('#wrapper').append(input2);
}

// function eraseLine(ctx) {
// 	ctx.clearRect(100, 100, 500, 500);
// }

// EVENT HANDLERS
// retrieve start and end points from inputs
function setPaths(input, ctx, pointsArr) {
	input.change(() => {
		console.log(`startPoint length: ${$('.startPoint').length}`);

	for (var i=0; i < $('.startPoint').length; i++) {
	$('.endPoints').each(function(){	
		let startPoint = $(`.startPoint:eq(${i})`).val();
		let endPoints = $(`.endPoints:eq(${i})`).val();

		if (endPoints.length > 0) {
			let endPointsArr = endPoints.replace(/ /g,'').toLowerCase().split(",")

			console.log('inputs valid')
			connectMultiplePoints(startPoint, endPointsArr, ctx, pointsArr)
		}				
	})	

	// let startPoint = $('.startPoint').val();
	// let endPoints = $('.endPoints').val();
	// 	console.log(`${startPoint}`);
	// 	let endPointsArr = endPoints.split(",")
	// 	if (startPoint.length > 0 && endPoints.length) {
	// 		console.log('inputs valid')
	// 		connectMultiplePoints(startPoint, endPointsArr, ctx, pointsArr)
	// 	}
	}
})
}

// toggle elmt on ENTER key press
function toggleElmt(elmtStr) {
	let elmt = $(elmtStr);
	let show = 'show';

	if (elmtStr === 'button') {
		show = 'show-inline';
	}

	$('body').keypress(function (e){
		if (e.keyCode === 13) {
			if (elmt.hasClass(show) || elmt.hasClass(show)) {
				elmt.removeClass(show);
				elmt.removeClass(show);
				elmt.addClass('hide');
			} else {
				elmt.removeClass('hide');
				elmt.addClass(show);	
			}
		}
	})
}

// toggle letter labels on SHIFT key press
// function toggleLetters() {
// 	$('body').keypress(function (e){
// 		if (e.keyCode === 16) {
// 		}
// 	})
// }

function showLetters2(ctx, id, left, top) {
	if (showLetters) {
		ctx.font = "20px Arial";	
		ctx.fillText(id, left-3, top-3); 
	}
}

function toggleLetters(ctx, id, left, top) {
	if (showLetters) {
		ctx.font = "14px Arial";	
		ctx.fillText(id.toUpperCase(), left-5, top-5); 
	}
	// $('body').keypress(function (e){
	// 	if (e.keyCode === 16) {	
			// console.log('shift key');
			// if (showLetters = true) {
			// 	ctx.font = "20px Arial";	
			// 	ctx.fillText(id, left-3, top-3); 				
			// 	showLetters = false;
			// } else {
			// 	showLetters = true;
			// }
	// 	}
	// })
}

// clear canvas on btn click
function clearCanvasBtnListener(ctx) {
	let dfd = $.Deferred();

	$('#clearCanvasBtn').on('click', () => {
		console.log('clearCanvasBtn clicked');
		clearCanvas(ctx);
	})

	dfd.resolve();

	return dfd.promise();
}

// user clicks replot lines btn
function replotPointsBtnListener(ctx) {
	let dfd = $.Deferred();

	$('#replotPointsBtn').on('click', () => {
		console.log('replotPointsBtn clicked');
		console.log(`allPoints length: ${allPoints.length}`);
			ctx.beginPath();			
			plotPoints(ctx, allPoints);
	})

	dfd.resolve();

	return dfd.promise();
}

// clear canvas & erase lines
function clearCanvas(ctx) {
	ctx.clearRect(0, 0, 1000, 1000);

	// clear input fields
	$('.endPoints').val('');	

	// (x, y, width, height)
	// console.log(`clearCanvas allPoints: ${JSON.stringify(allPoints)}`);

   // getPoints().then((points) => {
    	// console.log(`eraseLines getPoints: ${JSON.stringify(points)}`);

    	// plotPoints(ctx, allPoints)
    // });	
	// createCanvas().then((ctx) => {
	// 	ctx.beginPath();
	// 	plotPoints(ctx);
	// })
}

// // static placeholder function
// function staticLines(ctx) {
// 	ctx.moveTo(35, 30);
// 	ctx.lineTo(75, 50);
// 	ctx.stroke(); 	

// 	ctx.moveTo(75, 50);
// 	ctx.lineTo(50, 50);
// 	ctx.stroke(); 		

// 	ctx.moveTo(75, 50);
// 	ctx.lineTo(100, 100);
// 	ctx.stroke(); 	

// 	ctx.moveTo(75, 50);
// 	ctx.lineTo(750, 500.00001525878906);
// 	ctx.stroke(); 

// 	ctx.moveTo(35, 30);
// 	ctx.lineTo(100, 100);
// 	ctx.stroke(); 	

// 	ctx.moveTo(50, 50);
// 	ctx.lineTo(100, 100);
// 	ctx.stroke(); 		

// 	ctx.moveTo(50, 50);
// 	ctx.lineTo(750, 500.00001525878906);
// 	ctx.stroke(); 	

// 	ctx.moveTo(35, 30);
// 	ctx.lineTo(750, 500.00001525878906);
// 	ctx.stroke(); 	

// 	ctx.moveTo(100,100);
// 	ctx.lineTo(750, 500.00001525878906);
// 	ctx.stroke(); 
// }


function getPositionXY(elmt) { 
    var coords = elmt.position();
    return coords;
} 

// draw line from start to end coords
// function drawLine(start, end) {
// }

function createCanvas() {
	let dfd = jQuery.Deferred();

	var Canvas_width=1000;
	var Canvas_height=1000;
	var CanvasElement = $("<canvas width='" + Canvas_width + "'height='" + Canvas_height + "'></canvas>");

	// Add the canvas element
	document.body.appendChild(CanvasElement[0]);

	// create the canvas context
	var ctx=CanvasElement[0].getContext("2d");

	dfd.resolve(ctx);
	
	return dfd.promise();
}
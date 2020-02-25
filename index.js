// all divs in body
let allDivs = document.body.getElementsByTagName('div');

$(function() {
	createCanvas().then((ctx) => {
		ctx.beginPath();
		plotPoints(ctx);
		
		// drawLine(ctx, (100,100), (500.00001525878906, 750));
		// drawLine(ctx, (500.00001525878906, 750), (30, 35));
	})

    getPoints().then((points) => {
    	console.log(`getPoints: ${JSON.stringify(points)}`);
    });
});

// return array of point objects
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
	return dfd.promise();
}

// hide original points from DOC
function clear() {
	$('.a').addClass('hide');
}


// plot points on HTML canvas
function plotPoints(ctx) {
	let currentIndex;
	getPoints().then((pointsArr) => {
		// getPos("b", pointsArr, null);
		// console.log(`plotPoints: ${pointsArr.length}`);

		// console.log(`getPointById: ${JSON.stringify(getPointById("f", pointsArr))}`);

			for (var i = 0; i < pointsArr.length; i++) {
			// let startPos = points[i]['pos'];	

			// let endPos = pointsArr[3]['pos'];
			let point = pointsArr[i];
			let id = point['id'];
			let left = point['pos']['left'];
			let top = point['pos']['top'];
				
			ctx.font = "20px Arial";	
			ctx.fillText(id, left-3, top-3); 
			ctx.fillRect(left,top,4,4); // (x, y, width, height)
					
			// ctx.moveTo(top, left);
			// ctx.lineTo(20, 20);
			// ctx.stroke(); 		

			// working		
			// drawLine(ctx, left, top, 20,20);
		}

		// connectTwoPoints('b', 'c', ctx, pointsArr);
		// connectTwoPoints('e', 'f', ctx, pointsArr);
		// connectTwoPoints('b', 'd', ctx, pointsArr);

		connectMultiplePoints('b', ['c', 'd', 'e'], ctx, pointsArr)
		// drawLine(ctx, 100, 100, 750, 500.00001525878906);
	})

	clear();
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
	    return point.id == id;
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

// static placeholder function
function staticLines(ctx) {
	ctx.moveTo(35, 30);
	ctx.lineTo(75, 50);
	ctx.stroke(); 	

	ctx.moveTo(75, 50);
	ctx.lineTo(50, 50);
	ctx.stroke(); 		

	ctx.moveTo(75, 50);
	ctx.lineTo(100, 100);
	ctx.stroke(); 	

	ctx.moveTo(75, 50);
	ctx.lineTo(750, 500.00001525878906);
	ctx.stroke(); 

	ctx.moveTo(35, 30);
	ctx.lineTo(100, 100);
	ctx.stroke(); 	

	ctx.moveTo(50, 50);
	ctx.lineTo(100, 100);
	ctx.stroke(); 		

	ctx.moveTo(50, 50);
	ctx.lineTo(750, 500.00001525878906);
	ctx.stroke(); 	

	ctx.moveTo(35, 30);
	ctx.lineTo(750, 500.00001525878906);
	ctx.stroke(); 	

	ctx.moveTo(100,100);
	ctx.lineTo(750, 500.00001525878906);
	ctx.stroke(); 
}


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

class Point {
    
    /**
     * Creates a Point.
     * @param {number} x - the x coordinate.
     * @param {number} y - the y coordinate.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
} // end class Point

// Array of line colors to cycle through
let colors = ['red', 'orangered', 'orange', 'yellow', 'greenyellow', 'green', 'turquoise', 'blue', 'indigo', 'purple'];
let colorIndex = 0;

const n = 8; // number of layers to generate (actual number of layers will be 2n).
const L = Math.pow(2, n); // pixel length of line segments in baseline.
var nslider = document.getElementById('nslider'); 
nslider.setAttribute('max', 2*(n-1)); // set number of slider points

/* Set up canvas */
let canvas = resetCanvas(null);

/* Generate baseline */
let baseline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
// Set of coordinates that defines the baseline
//let baselineCoords = [new Point(0,2), new Point(1, 2), new Point(2, 2), new Point(2, 1), new Point(2, 0)]; // Corner
//let baselineCoords = [new Point(0,1), new Point(0,2), new Point(1, 2), new Point(2, 2), new Point(2, 1), new Point(2, 0), new Point(1,0), new Point(1, 1)]; // Spiral
//let baselineCoords = [new Point(0,1), new Point(0,2), new Point(1, 2), new Point(2, 2), new Point(2, 1), new Point(3, 1), new Point(3,2), new Point(4, 2)]; // Spiral
//let baselineCoords = [new Point(0,1), new Point(0,2), new Point(1, 2), new Point(1, 1), new Point(2, 1), new Point(2, 2), new Point(3,2), new Point(3, 1), new Point(3,0), new Point(2,0), new Point(1,0), new Point(0,0), new Point(0,1)]; // Squarepants
//let baselineCoords = [new Point(1,2), new Point(1,1), new Point(2,1), new Point(2,0)]; // Original
//let baselineCoords = [new Point(2,0), new Point(1,0), new Point(1,1), new Point(2,1), new Point(2,2), new Point(1,2)]; // S curve
//let baselineCoords = [new Point(1,1), new Point(2,1)] // Single segment

lines = drawLines([new Point(1,2), new Point(1,1), new Point(2,1), new Point(2,0)]); // Original

var showAll = true;
var showallButton = document.getElementById('showall');
var animate = false;
var doAnimate = document.getElementById('doAnimate');

showallButton.oninput = function() {
    showAll = !showallButton.checked;
    updateVisibility();
}

nslider.oninput = function() {
    updateVisibility();
    updateAnimation();
}

doAnimate.oninput = function() {
    animate = doAnimate.checked;
    updateAnimation();
}

var preset1 = document.getElementById('preset1')
preset1.onclick = function() {
    canvas = resetCanvas(canvas);
    lines = drawLines([new Point(1,2), new Point(1,1), new Point(2,1), new Point(2,0)]); // Original
}
var preset2 = document.getElementById('preset2')
preset2.onclick = function() {
    canvas = resetCanvas(canvas);
    lines = drawLines([new Point(0,2), new Point(1, 2), new Point(2, 2), new Point(2, 1), new Point(2, 0)]); // Corner
}
var preset3 = document.getElementById('preset3')
preset3.onclick = function() {
    canvas = resetCanvas(canvas);
    lines = drawLines([new Point(0,1), new Point(0,2), new Point(1, 2), new Point(2, 2), new Point(2, 1), new Point(2, 0), new Point(1,0), new Point(1, 1)]); // Spiral 1
}
var preset4 = document.getElementById('preset4')
preset4.onclick = function() {
    canvas = resetCanvas(canvas);
    lines = drawLines([new Point(0,1), new Point(0,2), new Point(1, 2), new Point(2, 2), new Point(2, 1), new Point(3, 1), new Point(3,2), new Point(4, 2)]); // Squiggle
}
var preset5 = document.getElementById('preset5')
preset5.onclick = function() {
    canvas = resetCanvas(canvas);
    lines = drawLines([new Point(1,1), new Point(2,1)]); // Single segment
}
var preset6 = document.getElementById('preset6')
preset6.onclick = function() {
    canvas = resetCanvas(canvas);
    lines = drawLines([new Point(2,0), new Point(1,0), new Point(1,1), new Point(2,1), new Point(2,2), new Point(1,2)]); // S curve
}
var preset7 = document.getElementById('preset7')
preset7.onclick = function() {
    canvas = resetCanvas(canvas);
    lines = drawLines([new Point(0,1), new Point(0,2), new Point(1, 2), new Point(1, 1), new Point(2, 1), new Point(2, 2), new Point(3,2), new Point(3, 1), new Point(3,0), new Point(2,0), new Point(1,0), new Point(0,0), new Point(0,1)]); // Squarepants
}

/**
 * Resets the canvas
 */
function resetCanvas(thiscanvas) {
    if (thiscanvas != null) {
        document.getElementById('canvas-div').removeChild(thiscanvas);
    }
    thiscanvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    thiscanvas.setAttributeNS(null, 'height', '100%');
    thiscanvas.setAttributeNS(null, 'width', '100%');
    thiscanvas.setAttributeNS(null, 'id', 'canvas');
    document.getElementById('canvas-div').appendChild(thiscanvas);

    colorIndex = 0;
    nslider.value = 0;
    return thiscanvas;
}

/**
 * Draws the entire dragon curve
 * @param {array of Points} - a properly formatted baseline coordinates array
 * @return an array of Elements that contains all of the lines
 */
function drawLines(baselineCoords) {
    // Convert input coordinates to actual coordinates
    for (let i = 0; i < baselineCoords.length; i++) {
        baselineCoords[i].x = (baselineCoords[i].x + 1)*L;
        baselineCoords[i].y = (baselineCoords[i].y + 1)*L;
    }

    // Generate data string that encodes the svg line
    let data = "M"+baselineCoords[0].x+' '+baselineCoords[0].y;
    for (let i = 1; i < baselineCoords.length; i++) {
        data += ' L'+baselineCoords[i].x+' '+baselineCoords[i].y;
    }

    baseline.setAttributeNS(null, 'd', data);
    setVisuals(baseline, 0);
    baseline.setAttributeNS(null, 'visibility', 'visible');

    canvas.appendChild(baseline);

    let newlines = [baseline]; // Array to store all generated layers

    /* Generate remaining layers */
    let prevPoints = baselineCoords; // Stores coordinates of previous layer's line
    let points = []; // Stores coordinates of current layer's line

    for (let i = 1; i < n; i++) {
        /* Generate points for line */

        let l = L/Math.pow(2, i); // pixel length for line segments in current layer
        points.push(prevPoints[0]);
        for (let j = 0; j < prevPoints.length-1; j++) {
            let p = prevPoints[j];
            let next = prevPoints[j+1];
            let v = new Point( next.x - p.x, next.y - p.y ); // Orientation of the parent line segment.
        
            if (v.x == 0 && v.y < 0) { // North
                if (j % 2 == 0) {
                    points.push(new Point(p.x-l, p.y));
                    points.push(new Point(p.x-l, p.y-l));
                    points.push(new Point(p.x, p.y-l));
                    points.push(new Point(p.x, p.y-(2*l)));
                } else {
                    points.push(new Point(p.x, p.y-l));
                    points.push(new Point(p.x+l, p.y-l));
                    points.push(new Point(p.x+l, p.y-(2*l)));
                    points.push(new Point(p.x, p.y-(2*l)));
                }
            }
            if (v.x > 0 && v.y == 0) { // East
                if (j % 2 == 0) {
                    points.push(new Point(p.x, p.y-l));
                    points.push(new Point(p.x+l, p.y-l));
                    points.push(new Point(p.x+l, p.y));
                    points.push(new Point(p.x+(2*l), p.y));
                } else {
                    points.push(new Point(p.x+l, p.y));
                    points.push(new Point(p.x+l, p.y+l));
                    points.push(new Point(p.x+(2*l), p.y+l));
                    points.push(new Point(p.x+(2*l), p.y));
                }
            }
            if (v.x == 0 && v.y > 0) { // South
                if (j % 2 == 0) {
                    points.push(new Point(p.x+l, p.y));
                    points.push(new Point(p.x+l, p.y+l));
                    points.push(new Point(p.x, p.y+l));
                    points.push(new Point(p.x, p.y+(2*l)));
                } else {
                    points.push(new Point(p.x, p.y+l));
                    points.push(new Point(p.x-l, p.y+l));
                    points.push(new Point(p.x-l, p.y+(2*l)));
                    points.push(new Point(p.x, p.y+(2*l)));
                }
            }
            if (v.x < 0 && v.y == 0) { // West
                if (j % 2 == 0) {
                    points.push(new Point(p.x, p.y+l));
                    points.push(new Point(p.x-l, p.y+l));
                    points.push(new Point(p.x-l, p.y));
                    points.push(new Point(p.x-(2*l), p.y));
                } else {
                    points.push(new Point(p.x-l, p.y));
                    points.push(new Point(p.x-l, p.y-l));
                    points.push(new Point(p.x-(2*l), p.y-l));
                    points.push(new Point(p.x-(2*l), p.y));
                }
            }
        }

        /* Creating data string using generated points */
        let data = 'M'+points[0].x+' '+points[0].y;
        let diagdata = data;
        for (let k = 1; k < points.length; k++) {
            data += ' L'+points[k].x+' '+points[k].y;
            if (k % 2 == 0)
                diagdata += ' L'+points[k].x+' '+points[k].y;
        }

        /* Create svg paths */
        let line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let diagline = document.createElementNS('http://www.w3.org/2000/svg', 'path');

        diagline.setAttributeNS(null, 'd', diagdata);
        setVisuals(diagline, i);
        canvas.appendChild(diagline);
        newlines.push(diagline);

        line.setAttributeNS(null, 'd', data);
        setVisuals(line, i);
        canvas.appendChild(line);
        newlines.push(line);

        /* Set up arrays for next loop iteration */
        prevPoints = points.slice();
        points = [];
    }

    return newlines;
}

/**
 * Sets all of the initial visual attributes of the line.
 * @param {svg path} line -  the path object to manipulate.
 * @param {integer} i - the layer the line is being drawn on.
 */
function setVisuals(line, i) {
    line.setAttributeNS(null, 'class', 'line'); // Allows animation to run
    line.setAttributeNS(null, 'stroke', colors[++colorIndex % colors.length]); // Makes the line colors cycle through an array of rainbow colors
    line.setAttributeNS(null, 'visibility', 'hidden'); // Lines are hidden by default until revealed by slider input
    line.setAttributeNS(null, 'stroke-width', n-i); // Lines get progressively thinner
    let pathLength = line.getTotalLength();
    line.setAttributeNS(null, 'stroke-dasharray', pathLength + ' ' + pathLength);
    line.setAttributeNS(null, 'stroke-dashoffset', 0);
    line.setAttribute('animation-play-state', 'paused');
}

/**
 * Updates the visibility of the layers based on the current value of the slider and the showAll boolean.
 */
function updateVisibility() {
    console.log("length:"+lines.length);
    console.log(lines);
    for (let i = 0; i < lines.length; i++) {
        if (i == nslider.value || (i < nslider.value && showAll)) {
            console.log(i);
            console.log(lines[i]);
            lines[i].setAttributeNS(null, 'visibility', 'visible');
        } else {
            lines[i].setAttributeNS(null, 'visibility', 'hidden');
        }
    }
    console.log(lines[1]);
}

/**
 * Updates whether the drawing animation is running based on the animate boolean.
 */
function updateAnimation() {
    for (let i = 0; i < lines.length; i++) {
        if (animate) {
            lines[i].setAttributeNS(null, 'stroke-dashoffset', lines[i].getTotalLength());
            lines[i].setAttribute('animation-play-state', 'running');
        } else {
            lines[i].setAttribute('animation-play-state', 'paused');
            lines[i].setAttributeNS(null, 'stroke-dashoffset', 0);
        }
    }
}

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

/* Global Vars */

// Array of line colors to cycle through
let colors = ['red', 'orangered', 'orange', 'yellow', 'greenyellow', 'green', 'turquoise', 'blue', 'indigo', 'purple'];
let colorIndex = 0;

const n = 8; // number of layers to generate (actual number of layers will be 2n).
const L = Math.pow(2, n); // pixel length of line segments in baseline.
var nslider = document.getElementById('nslider'); 
nslider.setAttribute('max', 2*(n-1)); // set number of slider points

let selectedPoints = [];
let drawingCustomLine = false;

/* Set up canvas */
let canvas = resetCanvas(null);

/* Generate initial dragon curve */
let baseline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
let lines = drawLines([new Point(1,2), new Point(1,1), new Point(2,1), new Point(2,0)]); // Original

/* oninput functions */
var showAll = true;
var showallButton = document.getElementById('showall');
var animate = false;
var doAnimate = document.getElementById('doAnimate');

showallButton.oninput = function() {
    showAll = !showallButton.checked;
    updateVisibility(lines);
}

nslider.oninput = function() {
    updateVisibility(lines);
    updateAnimation(lines);
}

doAnimate.oninput = function() {
    animate = doAnimate.checked;
    updateAnimation(lines);
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
    lines = drawLines([new Point(0,1), new Point(0,2), new Point(1, 2), new Point(2, 2), new Point(2, 1), new Point(2, 0), new Point(1,0), new Point(1, 1)]); // Spiral
}
var preset4 = document.getElementById('preset4')
preset4.onclick = function() {
    canvas = resetCanvas(canvas);
    lines = drawLines([new Point(0,1), new Point(0,2), new Point(1, 2), new Point(2, 2), new Point(2, 1), new Point(3, 1), new Point(3,2), new Point(4, 2)]); // Inchworm
}
var preset5 = document.getElementById('preset5')
preset5.onclick = function() {
    canvas = resetCanvas(canvas);
    lines = drawLines([new Point(1,1), new Point(2,1)]); // Line segment
}
var preset6 = document.getElementById('preset6')
preset6.onclick = function() {
    canvas = resetCanvas(canvas);
    lines = drawLines([new Point(2,0), new Point(1,0), new Point(1,1), new Point(2,1), new Point(2,2), new Point(1,2)]); // Figure S
}
var preset7 = document.getElementById('preset7')
preset7.onclick = function() {
    canvas = resetCanvas(canvas);
    lines = drawLines([new Point(0,1), new Point(0,2), new Point(1, 2), new Point(1, 1), new Point(2, 1), new Point(2, 2), new Point(3,2), new Point(3, 1), new Point(3,0), new Point(2,0), new Point(1,0), new Point(0,0), new Point(0,1)]); // Arch
}
var custom = document.getElementById('custom');
custom.onclick = function() {
    canvas = resetCanvas(canvas);
    initializeCreateMode();
}

/* Custom baseline creation functions */
let selectionCanvas;
function initializeCreateMode() {
    selectionCanvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    selectionCanvas.setAttributeNS(null, 'height', '100%');
    selectionCanvas.setAttributeNS(null, 'width', '100%');
    selectionCanvas.setAttributeNS(null, 'id', 'selection-canvas');
    canvas.appendChild(selectionCanvas);

    // Set starting point
    let x = document.getElementById('canvas-div').offsetWidth/L - 1;
    for (let i = 0; i < x; i++) {
        for (let j = 0; j < x; j++) {
            circ = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circ.setAttributeNS(null, 'cx', (i+1)*L+"");
            circ.setAttributeNS(null, 'cy', (j+1)*L+"");
            circ.setAttributeNS(null, 'r', '10');
            circ.setAttributeNS(null, 'class', 'unclicked-point');
            circ.onmousedown = circleClicked;
            selectionCanvas.appendChild(circ);
        }
    }
    drawingCustomLine = true;
}

function circleClicked(event) {
    
    let circ = event.target;
    circ.setAttributeNS(null, 'class', 'clicked-point');
    selectedPoints.push(new Point(circ.cx.baseVal.value, circ.cy.baseVal.value));
    console.log("Clicked!", selectedPoints);
}

/* Visual Update Functions */

/**
 * Resets the canvas
 * @param {SVG Element | null} oldcanvas- the old canvas
 * @return {SVG Element} - the new canvas
 */
function resetCanvas(oldcanvas) {
    if (oldcanvas != null) {
        document.getElementById('canvas-div').removeChild(oldcanvas);
    }
    newcanvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    newcanvas.setAttributeNS(null, 'height', '100%');
    newcanvas.setAttributeNS(null, 'width', '100%');
    newcanvas.setAttributeNS(null, 'id', 'canvas');
    document.getElementById('canvas-div').appendChild(newcanvas);

    // Reset other global vars
    colorIndex = 0;
    drawingCustomLine = false;
    selectedPoints = [];

    return newcanvas;
}

/**
 * Draws the entire dragon curve
 * @param {array of Points} baselineCoords - a properly formatted baseline coordinates array
 * @return an array of SVG 'path' elements that contains all of the lines
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
        setVisuals(line, i+1);
        canvas.appendChild(line);
        newlines.push(line);

        /* Set up arrays for next loop iteration */
        prevPoints = points.slice();
        points = [];
    }

    updateAnimation(newlines);
    updateVisibility(newlines);
    return newlines;
}

/**
 * Sets all of the initial visual attributes of the line.
 * @param {svg path} line -  the path object to manipulate.
 * @param {integer} i - the layer the line is being drawn on. (controls stroke width)
 */
function setVisuals(line, i) {
    line.setAttributeNS(null, 'class', 'line'); // Allows animation to run
    line.setAttributeNS(null, 'stroke', colors[++colorIndex % colors.length]); // Makes the line colors cycle through an array of rainbow colors
    line.setAttributeNS(null, 'stroke-width', n-i+1); // Lines get progressively thinner
    let pathLength = line.getTotalLength();
    line.setAttributeNS(null, 'stroke-dasharray', pathLength + ' ' + pathLength);
}

/**
 * Updates the visibility of the layers based on the current value of the slider and the showAll boolean.
 * @param {svg path array} lines - array of svg paths
 */
function updateVisibility(lines) {
    for (let i = 0; i < lines.length; i++) {
        if (i == nslider.value || (i < nslider.value && showAll)) {
            lines[i].setAttributeNS(null, 'visibility', 'visible');
        } else {
            lines[i].setAttributeNS(null, 'visibility', 'hidden');
        }
    }
}

/**
 * Updates whether the drawing animation is running based on the animate boolean.
 * @param {svg path array} lines - array of svg paths
 */
function updateAnimation(lines) {
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
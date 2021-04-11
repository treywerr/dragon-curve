
class Point {
    
    /**
     * Creates a Node.
     * @param {number} x, y - the coordinates.
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
} // end class Point

let canvas = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
canvas.setAttributeNS(null, 'height', '100%');
canvas.setAttributeNS(null, 'width', '100%');
document.getElementById('canvas-div').appendChild(canvas);

let colors = ['red', 'orangered', 'orange', 'yellow', 'greenyellow', 'green', 'turquoise', 'blue', 'indigo', 'purple'];
let colorIndex = 0;

const n = 8; // number of layers to generate (actual number of layers will be 2*n).
var L = Math.pow(2, n); // pixel length of line segments in baseline.
document.getElementById('nslider').setAttribute('max', 2*(n-1));

let baseline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
//let baselineCoords = [new Point(0,2), new Point(1, 2), new Point(2, 2), new Point(2, 1), new Point(2, 0)]; // Corner
//let baselineCoords = [new Point(0,1), new Point(0,2), new Point(1, 2), new Point(2, 2), new Point(2, 1), new Point(2, 0), new Point(1,0), new Point(1, 1)]; // Spiral
let baselineCoords = [new Point(1,2), new Point(1,1), new Point(2,1), new Point(2,0)]; // Original
//let baselineCoords = [new Point(2,0), new Point(1,0), new Point(1,1), new Point(2,1), new Point(2,2), new Point(1,2)]; // S curve
for (let i = 0; i < baselineCoords.length; i++) {
    baselineCoords[i].x = (baselineCoords[i].x + 1)*L;
    baselineCoords[i].y = (baselineCoords[i].y + 1)*L;
}
let data = "M"+baselineCoords[0].x+' '+baselineCoords[0].y;
for (let i = 1; i < baselineCoords.length; i++) {
    data += ' L'+baselineCoords[i].x+' '+baselineCoords[i].y;
}
baseline.setAttributeNS(null, 'd', data);
baseline.setAttributeNS(null, 'class', 'line');
baseline.setAttributeNS(null, 'stroke', colors[colorIndex]);
baseline.setAttributeNS(null, 'stroke-width', n);

canvas.appendChild(baseline);

let lines = [baseline];

let prevPoints = baselineCoords;
let points = [];

for (let i = 1; i < n; i++) {
    //console.log("n = "+i);
    /* Generate points for line */

    let l = L/Math.pow(2, i);
    points.push(prevPoints[0]);
    for (let j = 0; j < prevPoints.length-1; j++) {
        let p = prevPoints[j];
        let next = prevPoints[j+1];
        let v = new Point( next.x - p.x, next.y - p.y ); // Orientation of the parent line segment.
        //console.log("p = ("+p.x+','+p.y+')');
        
        if (v.x == 0 && v.y < 0) { // North
            //console.log("North");
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
            //console.log("East");
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
            //console.log("South");
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
            //console.log("West");
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
        //console.log("p = ("+points[k].x/L+','+points[k].y/L+')');
        data += ' L'+points[k].x+' '+points[k].y;
        if (k % 2 == 0)
            diagdata += ' L'+points[k].x+' '+points[k].y;
    }

    /* Create svg paths */

    let line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let diagline = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    diagline.setAttributeNS(null, 'd', diagdata);
    diagline.setAttributeNS(null, 'class', 'line');
    diagline.setAttributeNS(null, 'stroke', colors[++colorIndex % colors.length]); // Makes the line colors cycle through an array of rainbow colors
    diagline.setAttributeNS(null, 'visibility', 'hidden'); // Lines are hidden by default until revealed by slider input
    diagline.setAttributeNS(null, 'stroke-width', n-i); // Lines get progressively thinner
    canvas.appendChild(diagline);
    lines.push(diagline);

    line.setAttributeNS(null, 'd', data);
    line.setAttributeNS(null, 'class', 'line');
    line.setAttributeNS(null, 'stroke', colors[++colorIndex % colors.length]);
    line.setAttributeNS(null, 'visibility', 'hidden');
    line.setAttributeNS(null, 'stroke-width', n-i);
    canvas.appendChild(line);
    lines.push(line);

    prevPoints = points.slice();
    points = [];
}

var nslider = document.getElementById('nslider'); 
var showAll = true;
var showall = document.getElementById('showall');

showall.oninput = function() {
    showAll = showall.checked;
    updateVisibility();
}

nslider.oninput = function() {
    updateVisibility();
}

function updateVisibility() {
    for (let i = 0; i < lines.length; i++) {
        if (i == nslider.value || (i < nslider.value && showAll)) {
            lines[i].setAttributeNS(null, 'visibility', 'visible');
        } else {
            lines[i].setAttributeNS(null, 'visibility', 'hidden');
        }
    }
}
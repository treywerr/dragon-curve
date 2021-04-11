
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

const L = 256; // pixel length of line segments in baseline.

let baseline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
let baselineCoords = [new Point(L, L*2), new Point(L, L), new Point(2*L, L), new Point(2*L, 0)]
let data = "M"+baselineCoords[0].x+' '+baselineCoords[0].y;
for (let i = 1; i < baselineCoords.length; i++) {
    data += ' L'+baselineCoords[i].x+' '+baselineCoords[i].y;
}
baseline.setAttributeNS(null, 'd', data);
baseline.setAttributeNS(null, 'class', 'baseline');

canvas.appendChild(baseline);

const n = 2; // number of iterations.

let colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
let colorIndex = 4;

let prevPoints = baselineCoords;
let points = [];

for (let i = 1; i <= n; i++) {
    console.log("n = "+i);
    /* Generate points for line */

    let l = L/Math.pow(2, i);
    points.push(prevPoints[0]);
    for (let j = 0; j < prevPoints.length-1; j++) {
        let p = prevPoints[j];
        let next = prevPoints[j+1];
        let v = new Point( next.x - p.x, next.y - p.y ); // Orientation of the parent line segment.
        console.log("p = ("+p.x+','+p.y+')');
        
        if (v.x == 0 && v.y < 0) { // North
            console.log("North");
            if (j % 2 == 0) {
                points.push(new Point(p.x-l, p.y));
                points.push(new Point(p.x-l, p.y-l));
                points.push(new Point(p.x, p.y-l));
                points.push(new Point(p.x, p.y-(2*l)));
            } else {
                points.push(new Point(p.x, p.y-l));
                points.push(new Point(p.x+l, p.y-l));
                points.push(new Point(p.x+1, p.y-(2*l)));
                points.push(new Point(p.x, p.y-(2*l)));
            }
        }
        if (v.x > 0 && v.y == 0) { // East
            console.log("East");
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
            console.log("South");
            if (j % 2 == 0) {
                points.push(new Point(p.x+l, p.y));
                points.push(new Point(p.x+l, p.y+l));
                points.push(new Point(p.x, p.y+l));
                points.push(new Point(p.x, p.y+(2*l)));
            } else {
                points.push(new Point(p.x, p.y+l));
                points.push(new Point(p.x-l, p.y+l));
                points.push(new Point(p.x-1, p.y+(2*l)));
                points.push(new Point(p.x, p.y+(2*l)));
            }
        }
        if (v.x < 0 && v.y == 0) { // West
            console.log("West");
            if (j % 2 == 0) {
                points.push(new Point(p.x, p.y-l));
                points.push(new Point(p.x+l, p.y-l));
                points.push(new Point(p.x+l, p.y));
                points.push(new Point(p.x+(2*l), p.y));
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
    for (let i = 1; i < points.length; i++) {
        data += ' L'+points[i].x+' '+points[i].y;
        if (i % 2 == 0)
            diagdata += ' L'+points[i].x+' '+points[i].y;
    }

    /* Create svg paths */

    let line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let diagline = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    diagline.setAttributeNS(null, 'd', diagdata);
    diagline.setAttributeNS(null, 'class', 'line');
    diagline.setAttributeNS(null, 'stroke', colors[++colorIndex % colors.length]);
    canvas.appendChild(diagline);

    line.setAttributeNS(null, 'd', data);
    line.setAttributeNS(null, 'class', 'line');
    line.setAttributeNS(null, 'stroke', colors[++colorIndex % colors.length]);
    canvas.appendChild(line);

    prevPoints = points.slice();
    points = [];
}
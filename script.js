
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

const L = 200; // pixel length of line segments in baseline.

let baseline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
let baselineCoords = [new Point(L, L*2), new Point(L, L), new Point(2*L, L), new Point(2*L, 0)]
let data = "M"+baselineCoords[0].x+' '+baselineCoords[0].y;
for (let i = 1; i < baselineCoords.length; i++) {
    data += ' L'+baselineCoords[i].x+' '+baselineCoords[i].y;
}
baseline.setAttributeNS(null, 'd', data);
baseline.setAttributeNS(null, 'class', 'baseline');

canvas.appendChild(baseline);

const n = 1; // number of iterations.

let prevPoints = baselineCoords;
let points = [];

for (let i = 1; i <= n; i++) {
    /* Generate points for line */
    let l = L/Math.pow(2, n);
    let p = prevPoints[0];
    points.push(prevPoints[0]);
    points.push(new Point(p.x-l, p.y));
    points.push(new Point(p.x-l, p.y-l));
    points.push(new Point(p.x, p.y-l));
    points.push(new Point(p.x, p.y-(2*l)));

    let line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let diagline = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    /* Creating data string using generated points */
    let data = 'M'+points[0].x+' '+points[0].y;
    let diagdata = data;
    for (let i = 1; i < points.length; i++) {
        data += ' L'+points[i].x+' '+points[i].y;
        if (i % 2 == 0)
            diagdata += ' L'+points[i].x+' '+points[i].y;
    }

    diagline.setAttributeNS(null, 'd', diagdata);
    diagline.setAttributeNS(null, 'class', 'diagline');
    canvas.appendChild(diagline);

    line.setAttributeNS(null, 'd', data);
    line.setAttributeNS(null, 'class', 'line');
    canvas.appendChild(line);

    prevPoints = points.slice();
    points = [];
}
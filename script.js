
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
let baselineCoords = [new Point(L, L*3), new Point(L,L*2), new Point(L*2, L*2), new Point(L*2, L)]
let dataString = "M"+baselineCoords[0].x+' '+baselineCoords[0].y;
for (let i = 1; i < baselineCoords.length; i++) {
    dataString += ' L'+baselineCoords[i].x+' '+baselineCoords[i].y;
}
baseline.setAttributeNS(null, 'd', dataString);
baseline.setAttributeNS(null, 'stroke', 'blue');
baseline.setAttributeNS(null, 'stroke-width', '5');
baseline.setAttributeNS(null, 'fill', 'none');

canvas.appendChild(baseline);
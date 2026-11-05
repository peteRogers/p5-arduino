
let ropes = [];
let rope;


function setup() {
  createCanvas(windowWidth, windowHeight);
  rope = new Rope(200, 0);
  // A row of ropes hanging from the top
    ropes.push(new Rope(width/2, 0, { length: height / 2, segments: 12, thickness: 10 }));
  
}

function draw() {
  background(255);
  rope.force(mouseX, mouseY, mouseX - pmouseX, mouseY-pmouseY, 120, 0.1);
  rope.update();
  rope.draw();
  ropes[0].force(mouseX, mouseY, mouseX - pmouseX, mouseY-pmouseY, 120, 0.1);
  ropes[0].update();
 // ropes[0].draw();
  
}

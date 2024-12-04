class Obstacle {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
    this.color = "pink";
  }

  show() {
    push();
    noStroke();
    image(obstacleImg, this.pos.x - this.r, this.pos.y - this.r, this.r * 2, this.r * 2); 
    pop();
  }
}
class Enemy {
  constructor(x, y, img) {
    this.pos = createVector(x, y);
    this.img = img;
    this.size = 90; 
  }

  show() {
    image(this.img, this.pos.x, this.pos.y, this.size, this.size);
  }
}
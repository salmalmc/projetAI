class Bullet {
  constructor(x, y, vx, vy) {
    //pos x et y de bullet
    this.x = x;
    this.y = y;
    //vittese x et y de bullet
    this.vx = vx;
    this.vy = vy;
  }

  update(delta) {
    //mise a jour de la position de la bullet en fct
    //de sa vitesse et temps
    this.x += this.vx * (delta / 1000);
    this.y += this.vy * (delta / 1000);
    // Retourne vrai si la balle sort de l'écran, sinon retourne faux
    return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }

  draw(delta) {
    //dessine la bullet
    stroke("yellow");
    strokeWeight(2);
    // Dessine la balle comme une ligne de sa position actuelle à sa position future
    line(
      this.x,
      this.y,
      this.x + (this.vx * delta) / 1000,
      this.y + (this.vy * delta) / 1000
    );
  }
}
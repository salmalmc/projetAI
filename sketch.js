let pursuer1, pursuer2;
let target;
let obstacles = [];
let vehicules = [];
let Wvehicules = [];
let snakeMode = false;
let debugCheckbox, snakeCheckbox, maxSpeedSlider, maxForceSlider;
let obstacleImg,vehicleImg;
let points = [];
let showInitials = false;
const flock = [];
let showBoids = false;
let boidsSlider, boidsLabel; 
let leaderMode = false;
let enemies;
let projectiles=[];
let enemyMode = false;
let bullets = [];
let cpt = 0;


// Fonction de préchargement des ressources
function preload() {
  bgImage = loadImage('assets/pink.jpg');
  obstacleImg = loadImage('assets/pl.png');
  vehicleImg = loadImage('assets/ppp.png');
  monsterImg = loadImage('assets/w.png');
  WanderImg = loadImage('assets/g.png');
  font = loadFont('assets/inconsolata.otf');
  enemyImg = loadImage('assets/m.png');
  
}

// Fonction de configuration initiale
function setup() {
  createCanvas(1000, 1000);
  pursuer1 = new Vehicle( 100, 100, vehicleImg); 
  //pursuer2 = new Vehicle(random(width), random(height), vehicleImg);


  vehicules.push(pursuer1);
  // vehicules.push(pursuer2);
   // Initialisation des véhicules
  
   creerSlidersPourProprietesVehicules();  // Créer les sliders pour ajuster les propriétés des véhicules
   creerSliderPourNombreDeVehicules();    // Créer un slider pour le nombre de véhicules
   creerSliderPourNombreDeBoids();        // Créer un slider pour le nombre de boids




  // On cree un obstacle au milieu de l'écran
  obstacles.push(new Obstacle(width / 2, height / 2, 100, obstacleImg));
}



function draw() {
  background(bgImage);

  target = createVector(mouseX, mouseY);
  image(monsterImg, target.x, target.y, 50, 50);



  if (showBoids) {
    for (let boid of flock) {
      boid.edges();
      boid.flock(flock);
      boid.update();
      boid.show();
    }
  }

  if(enemyMode)
    {
        enemies.show();
    }
  

  // Dessin des obstacles
  if (!showInitials) {
    obstacles.forEach(o => o.show());
  }

  // Gestion de la dispersion des initiales
  if (showInitials) {
    points.forEach((t) => {
      push();
      fill("orange");
      noStroke();
      circle(t.x, t.y, 10);
      pop();
    });
  }

  // Gestion des véhicules
  vehicules.forEach((v, index) => {
    if (showInitials && points.length > 0) {
      if (!v.initialTarget) {
        v.initialTarget = points[index % points.length];
        v.reachedTargetFlag = false; 
      }
  
      if (!v.reachedTargetFlag) {
        if (!v.reachedTarget()) {
          let seekForce = v.seek(v.initialTarget);
          v.applyForce(seekForce);
        } else {
          v.reachedTargetFlag = true; 
          v.vel.set(0, 0); 
          v.acc.set(0, 0);
        }
      }
    } else if (snakeMode) {  // Mode serpent
      if (index === 0) {
        v.applyBehaviors(target, obstacles, vehicules);
      } else {
        let followForce = v.follow(vehicules[index - 1].pos, 50);
        let avoidForce = v.avoid(obstacles).mult(3.0);
        v.applyForce(followForce);
        v.applyForce(avoidForce);
      }
    } else if (leaderMode) { // Mode leader
      if (index === 0) {
        // Le premier véhicule est le leader
        v.applyBehaviors(target, obstacles, vehicules);
        push();
        fill("yellow"); 
        noStroke();
        circle(v.pos.x, v.pos.y, 60); // Cercle jaune sur la position du véhicule leader
        pop();
      }
       else {
        // Les autres suivent le leader
        let followForce = v.follow(vehicules[0].pos, 50); // Suivre le leader
        let avoidForce = v.avoid(obstacles).mult(3.0); // Éviter les obstacles
        v.applyForce(followForce);
        v.applyForce(avoidForce);
      }
    }
      else if(enemyMode) // Mode ennemi
        {
          v.maxSpeed = 0;
          if(bullets.length === 0)
          {
            bullets = vehicules.map(b => {
              let m = new Vehicle(b.pos.x, b.pos.y);
              m.applyForce(m.arrive(enemies.pos));
              m.maxSpeed = 6;
              m.maxForce = 2;
              m.color = "red";
              m.r_pourDessin = 5;
              return m;
            });
          }
        } else {
          v.maxSpeed = 4;
      v.applyBehaviors(target, obstacles, vehicules);
    }
    
  
    v.update();
    v.show();
  });  
  

    // Gestion des balles
    bullets.forEach((bullet, index) => {
      bullet.color = "pink";
      bullet.applyForce(bullet.arrive(enemies.pos));
      bullet.update();
      bullet.show();

      if (bullet.pos.dist(enemies.pos) < 8) {
        bullets.splice(index, 1);  // Retirer la balle lorsque l'ennemi est atteint
        cpt++;
        if (cpt >= 3) {
          cpt = 0;
          enemyMode = false;  // Désactiver le mode ennemi
        }
      }
    });

 // Affichage des véhicules en mode Wanderr
  Wvehicules.forEach((v) => {
    v.wander();
    v.avoid(obstacles);
    v.edges();
    v.update();
    v.show();
  });

  // Affichage des boids
  for (let boid of flock) {
    boid.edges();
    boid.flock(flock);
    boid.update();
    boid.show();
  }  
}


// Fonction pour créer les boids
function createBoids(num) {
  for (let i = 0; i < num; i++) {
    flock.push(new Boid(random(width), random(height))); // Initialise avec des positions aléatoires
  }
}

// Fonction pour mettre à jour le nombre de boids
function updateBoids(num) {
  if (flock.length < num) {
    // Ajouter des boids si le nombre actuel est inférieur à la valeur du slider
    for (let i = flock.length; i < num; i++) {
      flock.push(new Boid(random(width), random(height))); // Initialiser avec une position aléatoire
    }
  } else if (flock.length > num) {
    // Supprimer des boids si le nombre actuel est supérieur à la valeur du slider
    flock.splice(num); // Enlever les boids excédentaires
  }
}

// Fonction pour créer un slider pour ajuster le nombre de boids
function creerSliderPourNombreDeBoids() {
  boidsSlider = createSlider(0, 500, 0, 1);  // Définir à 0 par défaut
  boidsSlider.position(160, 140);
  boidsLabel = createP("Nb de boids : " + boidsSlider.value());
  boidsLabel.position(10, 130);
  boidsLabel.style('color', 'white');

  // Mettre à jour les boids en fonction de la valeur du slider
  boidsSlider.input(() => {
    updateBoids(boidsSlider.value());
    boidsLabel.html("Nb de boids : " + boidsSlider.value());
  });
}

// Ajouter un obstacle de taille aléatoire à la position de la souris
/*function mousePressed() {
  obstacles.push(new Obstacle(mouseX, mouseY, random(20, 100), "pink"));
}*/

//Création du nom 
function createTargetsAvecMesIntiales() {
  points = [];

  // Calcul de la largeur du texte pour le centrer
  let textBounds = font.textBounds('Salma', 0, 0, 235); 
  let centerX = (width - textBounds.w) / 2; 
  let centerY = (height + textBounds.h) / 2; 

  let rawPoints = font.textToPoints('Salma', centerX, centerY, 235, { sampleFactor: 0.05 });

    rawPoints.forEach((point) => {
    points.push(createVector(point.x, point.y));
  });
}


function creerSlidersPourProprietesVehicules() {
  // paramètres de la fonction custom de création de sliders :
  // label, min, max, val, step, posX, posY, propriete des véhicules
  // creerUnSlider("Rayon du cercle", 10, 200, 50, 1, 10, 20, "wanderRadius");
  // creerUnSlider("Distance du cercle", 10, 400, 100, 1, 10, 40, "distanceCercle");
  // creerUnSlider("Deviation maxi", 0, PI/2, 0.3, 0.01, 10, 60, "displaceRange");
  creerUnSlider("Vitesse maxi", 1, 20, 4, 0.1, 10, 20, "maxSpeed");
  creerUnSlider("Max force", 0.05, 1, 0.2, 0.1, 10, 40, "maxForce");
  

  // checkbox pour debug on / off
  debugCheckbox = createCheckbox('Debug ', false);
  debugCheckbox.position(10, 80);
  debugCheckbox.style('color', 'white');
  

  debugCheckbox.changed(() => {
    Vehicle.debug = !Vehicle.debug;
  });
}

function creerUnSlider(label, min, max, val, step, posX, posY, propriete) {
  let slider = createSlider(min, max, val, step);

  let labelP = createP(label);
  labelP.position(posX, posY);
  labelP.style('color', 'white');

  slider.position(posX + 150, posY + 17);

  let valueSpan = createSpan(slider.value());
  valueSpan.position(posX + 300, posY + 17);
  valueSpan.style('color', 'white');
  valueSpan.html(slider.value());

  slider.input(() => {
    valueSpan.html(slider.value());
    vehicules.forEach(vehicle => {
      vehicle[propriete] = slider.value(); 
    });
  });
}

  //slider pour le nombre des vehicules wander
function creerSliderPourNombreDeVehicules() {
  let nbVehiclesSlider = createSlider(0, 200, 0, 1);
  nbVehiclesSlider.position(160, 115);

  let nbVehiclesLabel = createP("Nb de véhicules W : " );
  nbVehiclesLabel.position(10, 100);
  nbVehiclesLabel.style('color', 'white');

  createWanderingVehicles(nbVehiclesSlider.value());

  nbVehiclesSlider.input(() => {
    updateWanderingVehicles(nbVehiclesSlider.value());
    nbVehiclesLabel.html("Nb de véhicules : " + nbVehiclesSlider.value());
  });

  this.nbVehiclesSlider = nbVehiclesSlider;
  this.nbVehiclesLabel = nbVehiclesLabel;
}

// pour crée les vehicules wander
function createWanderingVehicles(num) {
  for (let i = 0; i < num; i++) {
    let v = new Vehicle(random(width), random(height), WanderImg);
    v.wander();
    v.vel = new p5.Vector(random(1, 5), random(1, 5));
    Wvehicules.push(v);
  }
}

// mise à jour des vehicules wander
function updateWanderingVehicles(num) {
  Wvehicules = []; 
  createWanderingVehicles(num);
}



// Gestion des touches pour ajouter des véhicules ou basculer des modes
function keyPressed() {
  if (key === "o") {
    let randomX = random(width); 
    let randomY = random(height); 
    let randomSize = random(20, 100); 
    obstacles.push(new Obstacle(randomX, randomY, randomSize, obstacleImg));
  }
  else if(key === "v") {
    vehicules.push(new Vehicle(random(width), random(height), vehicleImg));
  }  
  else if (key === "s") {
    snakeMode = !snakeMode; 
  }
  else if (key === 'd') {
    Vehicle.debug = !Vehicle.debug;
    debugCheckbox.checked(Vehicle.debug);
  } else if (key === "f") {
    for (let i = 0; i < 10; i++) {
      let v = new Vehicle( 100, 100, vehicleImg); 
      v.vel = new p5.Vector(random(1, 5), random(1, 5)); 
      vehicules.push(v);
    }
  } else if  (key === "w") {
    createWanderingVehicles(5);
    let currentCount = Wvehicules.length;
    nbVehiclesSlider.value(currentCount); 
    nbVehiclesLabel.html("Nb de véhicules : " + currentCount); 
  
} else if (key === 'i') {
  showInitials = !showInitials;
  if (showInitials) {
    createTargetsAvecMesIntiales();
    vehicules.forEach(v => {
      v.initialTarget = null; 
    });
  } else {
    points = [];
    vehicules.forEach(v => {
      v.initialTarget = null;
    }); 
  }
}   else if (key =="b"){
      createBoids(50);
      let currentCount2 = flock.length;
      boidsSlider.value(currentCount2);
      boidsLabel.html("Nb de boids :"+ currentCount2 )
}
else if (key === "l") {
  leaderMode = !leaderMode; }
  else if (key == "e") {
    snakeMode = false;
    leaderMode = false;
    showInitials = false;
    let randomX = random(width);
    let randomY = random(height);
    enemies=new Enemy(randomX, randomY , enemyImg);
    enemyMode = !enemyMode;
  }

function createBoids(num) {
  for (let i = 0; i < num; i++) { 
    flock.push(new Boid(random(width), random(height))); 
  }
}

  Vehicle.prototype.reachedTarget = function () {
    if (!this.initialTarget) return false;
    const d = dist(this.pos.x, this.pos.y, this.initialTarget.x, this.initialTarget.y);
    return d < 5; 
  };
  
}
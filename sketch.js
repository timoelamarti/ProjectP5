let gameStarted = false; // Indique si le jeu a démarré
let target, vehicle;
let vehicles = [];
let targets = [];
let mode = "snake";
let snakeModeActive = false;
let originalTargets = [];
let bgImage; // Variable pour stocker l'image du fond


// Appelée avant de démarrer l'animation
function preload() {
  // en général on charge des images, des fontes de caractères etc.
  font = loadFont('./assets/inconsolata.otf');
  bgImage = loadImage('./assets/bg_02_h.png'); // Remplacez par le chemin de votre image
}

function setup() {
  createCanvas(1600, 550);

  target = createVector(random(width), random(height));

  // Transformer les cibles pour inclure les propriétés supplémentaires
  targets = font.textToPoints('TIMO!', 26, 260, 300, { sampleFactor: 0.05 })
    .map(p => ({
      x: p.x,
      y: p.y,
      originalX: p.x,
      originalY: p.y,
      hovered: false,
    }));

  // Créer une copie des positions originales des points
  originalTargets = targets.map(p => createVector(p.x, p.y));

  let rayon = 10;
  creerDesVehicules(targets.length, rayon);

  createP(
    "Appuyez sur 'd' pour afficher les infos de debug.<br/>Appuyez sur 'm' pour activer et reappuyer sur 'm' pour desactiver le snake mode.<br/>Les véhicules initialement fait du wandering.<br/>Appuyez sur 't' pour activer le mode texte."
  ); 

}

function creerDesVehicules(nb) {
  for (let i = 0; i < nb; i++) {
    let vehicle = new Vehicle(random(width), random(height));
    // on change le rayon
    vehicle.r = 10;
    vehicles.push(vehicle);
  }
}

// Dessin principal
  if (!gameStarted) {
    drawStartScreen(); // Affiche l'écran de démarrage
  }

// Fonction pour vérifier si le snake touche un emplacement en orange
function checkCollisionWithOrangeSpots(vehicle) {
  targets.forEach((spot, index) => {
    let d = dist(vehicle.pos.x, vehicle.pos.y, spot.x, spot.y);
    if (d < 20) {
      // Appliquer un mouvement cool à l'emplacement touché
      spot.hovered = true;
    }
  });
}

// Fonction pour appliquer l'effet wavy
function applyWavyEffect() {
  targets.forEach((spot, index) => {
    if (spot.hovered) {
      spot.x = originalTargets[index].x + sin(frameCount * 0.1) * 5;
      spot.y = originalTargets[index].y + cos(frameCount * 0.1) * 5;
    } else {
      spot.x = originalTargets[index].x;
      spot.y = originalTargets[index].y;
    }
  });
}

// Fonction pour ramener les points à leur position originale
function resetTargetPositions() {
  targets.forEach(spot => {
    if (!spot.hovered) {
      spot.x = lerp(spot.x, spot.originalX, 0.05);
      spot.y = lerp(spot.y, spot.originalY, 0.05);
    }
  });
}

function updateHoverStatus(vehicle) {
  targets.forEach(spot => {
    let d = dist(vehicle.pos.x, vehicle.pos.y, spot.x, spot.y);
    if (d > 20) {
      spot.hovered = false;
    }
  });
}

// appelée 60 fois par seconde
function draw() {


  if (!gameStarted) {
    drawStartScreen(); // Affiche l'écran de démarrage
    return; // Arrête l'exécution du reste tant que le jeu n'a pas commencé
  }

  // couleur pour effacer l'écran
  background(30, 30, 50); // Fond sombre avec une teinte bleutée

  // Appliquer l'effet wavy
  applyWavyEffect();

  // On dessine les points sur les targets qui forment un texte
  fill("orange");
  targets.forEach(spot => circle(spot.x, spot.y, 10));

  // Appeler la fonction pour ramener les points
  resetTargetPositions();

  // Cible qui suit la souris, cercle rouge de rayon 32
  target.x = mouseX;
  target.y = mouseY;
  fill(255, 0, 0);
  noStroke();
  ellipse(target.x, target.y, 32);

  // Optionnel : ajouter des étoiles pour un effet spatial
  for (let i = 0; i < 100; i++) {
    fill(255, random(100, 200)); // Étoiles blanches légèrement lumineuses
    noStroke();
    let x = random(width);
    let y = random(height);
    circle(x, y, random(1, 3)); // Petits cercles aléatoires pour les étoiles
  }


  vehicles.forEach((vehicle, index) => {
    switch (mode) {
      case "snake":
        if (index === 0) {
          // on a le premier véhicule
          // il suit la cible contrôlée par la souris
          steeringForce = vehicle.arrive(target, 0);
        } else {
          let vehiculePrecedent = vehicles[index - 1];
          steeringForce = vehicle.arrive(vehiculePrecedent.pos, 10);
        }
        break;
      case "texte":
        // chaque véhicule doit suivre un point de la cible, qui a le 
        // même index que lui
        let targetTexte = createVector(targets[index].x, targets[index].y);
        steeringForce = vehicle.arriveTexte(targetTexte);
        break;
    }

    vehicle.applyForce(steeringForce);
    // On met à jour la position et on dessine le véhicule
    vehicle.update();
    vehicle.edges(); // Call the edges function here
    vehicle.show();

    // Vérifier la collision avec les emplacements en orange
    checkCollisionWithOrangeSpots(vehicle);

    updateHoverStatus(vehicle);
  });

  // Fonction d'écran de démarrage


  // Ajouter le comportement de retour à leur place
  resetTargetPositions();

  for (let vehicle of vehicles) {
    if (snakeModeActive) {
      // Implement snake behavior here
      // For example, follow the previous vehicle
    } else {
      let wanderForce = vehicle.wander();
      vehicle.applyForce(wanderForce);
    }
    vehicle.update();
    vehicle.edges(); // Ensure edges are handled
    vehicle.show();
  }



}

function keyPressed() {
  if (key === 'd') {
    Vehicle.debug = !Vehicle.debug;
  } else if (key === 't') {
    mode = "texte";
    snakeModeActive = false;
  } else if (key === 'm') {
    snakeModeActive = !snakeModeActive;
    if (!snakeModeActive) {
      mode = ""; // Reset mode when snake mode is deactivated
    } else {
      mode = "snake"; // Activate snake mode
    }
  }


}

function drawStartScreen() {
  background(0);

  textAlign(CENTER, CENTER);
  fill(255);
  textSize(64);
  text("Welcome at TIMO", width / 2, height / 2 - 50);
  textSize(24);
  text("Click to begin", width / 2, height / 2 + 20);

   // Dessiner les étoiles
   for (let i = 0; i < 100; i++) {
    fill(255, random(100, 200)); // Étoiles blanches légèrement lumineuses
    noStroke();
    let x = random(width);
    let y = random(height);
    circle(x, y, random(1, 3)); // Petits cercles aléatoires pour les étoiles
  }
}

// Fonction pour démarrer le jeu au clic
function mousePressed() {
  if (!gameStarted) {
    gameStarted = true;
  }
}
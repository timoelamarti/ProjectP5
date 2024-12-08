class Vehicle {
    static debug = false;
  
    constructor(x, y) {
      this.pos = createVector(x, y);
      this.vel = createVector(0, 0);
      this.acc = createVector(0, 0);
      this.maxSpeed = 10;
      this.maxForce = 0.6;
      this.r = 16;
      this.rayonZoneDeFreinage = 100;
    }
  
    evade(vehicle) {
      let pursuit = this.pursue(vehicle);
      pursuit.mult(-1);
      return pursuit;
    }
  
    pursue(vehicle) {
      let target = vehicle.pos.copy();
      let prediction = vehicle.vel.copy();
      prediction.mult(10);
      target.add(prediction);
      fill(0, 255, 0);
      circle(target.x, target.y, 16);
      return this.seek(target);
    }
  
    arrive(target, d = 0) {
      // 2nd argument true enables the arrival behavior
      // 3rd argumlent d is the distance behind the target
      // for "snake" behavior
      return this.seek(target, true, d);
    }
  
    arriveTexte(target) {
      let desired = p5.Vector.sub(target, this.pos);
      let distance = desired.mag();
      let speed = this.maxSpeed;
      if (distance < this.rayonZoneDeFreinage) {
        speed = map(distance, 0, this.rayonZoneDeFreinage, 0, this.maxSpeed);
      }
      desired.setMag(speed);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      return steer;
    }

    flee(target) {
      // recopier code de flee de l'exemple précédent
    }
    
    wander() {
        // point devant le véhicule, centre du cercle
        let centreCercleDevant = this.vel.copy();
        centreCercleDevant.setMag(this.distanceCercle);
        centreCercleDevant.add(this.pos);
    
        if (Vehicle.debug) {
          // on le dessine sous la forme d'une petit cercle rouge
          fill("red");
          circle(centreCercleDevant.x, centreCercleDevant.y, 8);
    
          // Cercle autour du point
          noFill();
          stroke("white");
          circle(centreCercleDevant.x, centreCercleDevant.y, this.wanderRadius * 2);
    
          // on dessine une ligne qui relie le vaisseau à ce point
          // c'est la ligne blanche en face du vaisseau
          line(this.pos.x, this.pos.y, centreCercleDevant.x, centreCercleDevant.y);
        }
    
        // On va s'occuper de calculer le point vert SUR LE CERCLE
        // il fait un angle wanderTheta avec le centre du cercle
        // l'angle final par rapport à l'axe des X c'est l'angle du vaisseau
        // + cet angle
        let wanderAngle = this.vel.heading() + this.wanderTheta;
        // on calcule les coordonnées du point vert
        let pointSurCercle = createVector(this.wanderRadius * cos(wanderAngle), this.wanderRadius * sin(wanderAngle));
        // on ajoute la position du vaisseau
        pointSurCercle.add(centreCercleDevant);
    
        // maintenant pointSurCercle c'est un point sur le cercle
        // on le dessine sous la forme d'un cercle vert
        if (Vehicle.debug) {
          fill("lightGreen");
          circle(pointSurCercle.x, pointSurCercle.y, 8);
    
          // on dessine une ligne qui va du vaisseau vers le point sur le 
          // cercle
          line(this.pos.x, this.pos.y, pointSurCercle.x, pointSurCercle.y);
        }
        // on dessine le vecteur desiredSpeed qui va du vaisseau au point vert
        let desiredSpeed = p5.Vector.sub(pointSurCercle, this.pos);
    
        // On a donc la vitesse désirée que l'on cherche qui est le vecteur
        // allant du vaisseau au cercle vert. On le calcule :
        // ci-dessous, steer c'est la desiredSpeed directement !
        // Voir l'article de Craig Reynolds, Daniel Shiffman s'est trompé
        // dans sa vidéo, on ne calcule pas la formule classique
        // force = desiredSpeed - vitesseCourante, mais ici on a directement
        // force = desiredSpeed
        let force = p5.Vector.sub(desiredSpeed, this.vel);
        force.setMag(this.maxForce);
    
        // On déplace le point vert sur le cerlcle (en radians)
        this.wanderTheta += random(-this.displaceRange, this.displaceRange);
    
        return force;
    }


    // TODO : modifier pour ajouter un 3ème paramètre d
    // qui dira à quelle distance derrière le véhicule on doit s'arrêter
    // si d=0 c'est le comportement arrival normal
    seek(target, arrival, d = 0) {
      let desiredSpeed = p5.Vector.sub(target, this.pos);
      let desiredSpeedMagnitude = this.maxSpeed;
  
      if (arrival) {
        // on dessine un cercle de rayon 100 
        // centré sur le point d'arrivée
  
        if (Vehicle.debug) {
          noFill();
          stroke("white")
          circle(target.x, target.y, this.rayonZoneDeFreinage)
        }
        
        // on calcule la distance du véhicule
        // par rapport au centre du cercle
        const dist = p5.Vector.dist(this.pos, target);
  
        if (dist < this.rayonZoneDeFreinage) {
          // on va diminuer de manière proportionnelle à
          // la distance, la vitesse
          // on va utiliser la fonction map(...) de P5
          // qui permet de modifier une valeur dans un 
          // intervalle initial, vers la même valeur dans un
          // autre intervalle
          // newVal = map(value, start1, stop1, start2, stop2, [withinBounds])
          desiredSpeedMagnitude = map(dist, d, this.rayonZoneDeFreinage, 0, this.maxSpeed)
        }
      }
  
      // equation force = vitesseDesiree - vitesseActuelle
      desiredSpeed.setMag(desiredSpeedMagnitude);
      let force = p5.Vector.sub(desiredSpeed, this.vel);
      // et on limite la force
      force.limit(this.maxForce);
      return force;
    }
  
    seekCorrectionSnake(target, arrival = false, d) {
      let force = p5.Vector.sub(target, this.pos);
      let desiredSpeed = this.maxSpeed;
  
      if (arrival) {
        // On définit un rayon de 100 pixels autour de la cible
        // si la distance entre le véhicule courant et la cible
        // est inférieure à ce rayon, on ralentit le véhicule
        // desiredSpeed devient inversement proportionnelle à la distance
        // si la distance est petite, force = grande
        // Vous pourrez utiliser la fonction P5 
        // distance = map(valeur, valeurMin, valeurMax, nouvelleValeurMin, nouvelleValeurMax)
        // qui prend une valeur entre valeurMin et valeurMax et la transforme en une valeur
        // entre nouvelleValeurMin et nouvelleValeurMax
  
        // 1 - dessiner le cercle de rayon 100 autour de la target
        if (Vehicle.debug) {
          stroke(255, 255, 255);
          noFill();
          circle(target.x, target.y, this.rayonZoneDeFreinage);
        }
  
        // 2 - calcul de la distance entre la cible et le véhicule
        let distance = p5.Vector.dist(this.pos, target);
  
        // 3 - si distance < rayon du cercle, alors on modifie desiredSPeed
        // qui devient inversement proportionnelle à la distance.
        // si d = rayon alors desiredSpeed = maxSpeed
        // si d = 0 alors desiredSpeed = 0
        if (distance < this.rayonZoneDeFreinage) {
          desiredSpeed = map(distance, d, this.rayonZoneDeFreinage, 0, this.maxSpeed);
        }
      }
  
      force.setMag(desiredSpeed);
      force.sub(this.vel);
      force.limit(this.maxForce);
      return force;
    }
  
    applyForce(force) {
      this.acc.add(force);
    }
  
    update() {
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.set(0, 0);
    }
  
    show() {
      // Définir une couleur pour chaque véhicule
      strokeWeight(1);
      noStroke();
      fill(0, 102, 255); // Bleu vif
    
      // Dessiner un cercle pour le véhicule
      circle(this.pos.x, this.pos.y, this.r * 1.5);
    
      // Ajouter un effet visuel : dessiner un halo transparent autour du véhicule
      noFill();
      stroke(0, 102, 255, 80); // Halo bleu translucide
      circle(this.pos.x, this.pos.y, this.r * 3);
    }
  
    edges() {
      if (this.pos.x > width + this.r) {
        this.pos.x = -this.r;
      } else if (this.pos.x < -this.r) {
        this.pos.x = width + this.r;
      }
      if (this.pos.y > height + this.r) {
        this.pos.y = -this.r;
      } else if (this.pos.y < -this.r) {
        this.pos.y = height + this.r;
      }
    }
  }
  
  class Target extends Vehicle {
    constructor(x, y) {
      super(x, y);
      this.vel = p5.Vector.random2D();
      this.vel.mult(5);
    }
  
    show() {
      stroke(255);
      strokeWeight(2);
      fill("#F063A4");
      push();
      translate(this.pos.x, this.pos.y);
      circle(0, 0, this.r * 2);
      pop();
    }
  }
  
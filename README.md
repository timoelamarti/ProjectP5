# Projet P5.js

Ce projet utilise la bibliothèque P5.js pour créer une animation interactive avec des véhicules qui suivent des cibles et réagissent aux interactions de l'utilisateur.

![Screenshot 2024-12-08 181001](https://github.com/user-attachments/assets/8f7fa0ff-65e6-4568-adb6-50b7b5fe4538)
















## Structure du projet

- `assets/`
  - `inconsolata.otf` : Police de caractères utilisée dans le projet.
- `index.html` : Fichier HTML principal.
- `jsconfig.json` : Configuration JavaScript.
- `libraries/`
  - `p5.min.js` : Bibliothèque P5.js.
  - `p5.sound.min.js` : Bibliothèque P5.js pour le son.
- `sketch.js` : Code principal de l'animation.
- `style.css` : Styles CSS.
- `vehicle.js` : Définition de la classe `Vehicle`.

## Fonctionnalités

- **Mode Debug** : Appuyez sur 'd' pour afficher les informations de débogage.
- **Mode Snake** : Appuyez sur 'm' pour activer/désactiver le mode serpent.
- **Mode Texte** : Appuyez sur 't' pour activer le mode texte.
- **Effet Wavy** : Applique un effet ondulant aux cibles.
- **Collision** : Vérifie si un véhicule touche une cible orange.

## Installation

1. Clonez le dépôt.
2. Ouvrez `index.html` dans un navigateur.

## Utilisation

- Cliquez pour démarrer l'animation.
- Déplacez la souris pour déplacer la cible rouge.
- Les véhicules suivent la cible ou les points de texte selon le mode activé.

## Code Principal

### `sketch.js`

- `preload()`: Charge les ressources avant de démarrer l'animation.
- `setup()`: Initialise le canevas et les cibles.
- `draw()`: Fonction principale de dessin appelée 60 fois par seconde.
- `creerDesVehicules(nb)`: Crée et initialise les véhicules.
- `checkCollisionWithOrangeSpots(vehicle)`: Vérifie les collisions avec les cibles oranges.
- `applyWavyEffect()`: Applique un effet ondulant aux cibles.
- `resetTargetPositions()`: Réinitialise les positions des cibles.

### `vehicle.js`

- Classe `Vehicle`: Définit les comportements des véhicules (poursuite, évitement, errance, etc.).

## Auteurs

Hatim El Amarti

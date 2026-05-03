# Friction Skill 📦

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue.svg)](https://www.typescriptlang.org/)
[![Babylon.js](https://img.shields.io/badge/Babylon.js-7.5.0-purple.svg)](https://www.babylonjs.com/)
[![Vite](https://img.shields.io/badge/Vite-5.2.11-yellow.svg)](https://vitejs.dev/)

A casual physics simulation on static and kinetic friction over inclined planes — the first SHIFT simulation to integrate the **Havok physics engine** and a Clean Architecture-inspired layered design.

### [🎮 Play Now!](https://fisicagames.com.br/)

---

## 📄 Table of Contents

* [About the Game](#-about-the-game)
* [Key Features](#-key-features)
* [How to Play](#-how-to-play)
* [Tech Stack](#-tech-stack)
* [Installation and Setup](#-installation-and-setup)
* [Architecture and Technical Highlights](#-architecture-and-technical-highlights)
* [License](#-license)
* [Author](#-author)

---

## 📖 About the Game

**Friction Skill** is the fourth simulation of the SHIFT series, developed in June 2024. It challenges players to move a box from one inclined plane to another by controlling only the inclination angle of each plane. The game uses realistic simulations of static friction (μₛ), kinetic friction (μₖ), and the coefficient of restitution, all computed by the **Havok physics engine**.

The main challenge is to control the box as friction decreases and the coefficient of restitution increases at each successive plane, making the task progressively more difficult. Precision and timing are essential to advance without dropping the box.

This was the first simulation in the series to use a third-party rigid-body physics engine, marking an important shift from the manual physics modeling of the previous simulations.

---

## ✨ Key Features

* **Realistic Friction Dynamics (via Havok):**
  * Realistic transition between maximum static friction and kinetic friction.
  * Increasing coefficient of restitution at each plane, creating progressively harder challenges.
* **Score System:**
  * Golden boxes collected: **10 points** each.
  * Medals based on total score:
    * 🥈 **Silver:** 100 points.
    * 🥉 **Bronze:** 300 points.
    * 🥇 **Gold:** 600+ points.
* **Real-Time Force Visualization:** A vector representing the net force on the box is rendered on screen, computed from the change in linear velocity provided by the Havok engine.
* **Minimalist Design:** Clean scenery focused on the physics simulation.
* **Cross-Platform:** Optimized for browsers and mobile devices in portrait orientation.

---

## 🕹 How to Play

**Objective:** Move the main box from one inclined plane to the next, collecting golden boxes for points.

#### Controls

💻 **On PC:** Arrow keys (`◄` / `►`) to adjust the inclination angle of the planes (counterclockwise / clockwise).

📱 **On Mobile / Touch:** Two on-screen buttons to adjust inclination in both directions.

**Tips:**

* Watch the friction transitions carefully — the static-to-kinetic transition is the key moment.
* Avoid letting the box fall before reaching the next plane.

---

## 🛠 Tech Stack

| Tool                                       | Version | Description                                                              |
| ------------------------------------------ | ------- | ------------------------------------------------------------------------ |
| [TypeScript](https://www.typescriptlang.org/) | 5.7.2   | Core language, providing type safety and modular architecture.           |
| [Babylon.js](https://www.babylonjs.com/)      | 7.5.0   | Graphics engine for 3D rendering, animations, and GUI system.            |
| [Havok](https://www.havok.com/)               | latest  | Industry-grade physics engine for realistic rigid-body interactions.     |
| [Vite.js](https://vitejs.dev/)                | 5.2.11  | Build tool for ES6 module compilation, tree-shaking, and optimization.   |
| [Node.js](https://nodejs.org/en)              | 20+     | Development environment and runtime.                                     |

---

## 🚀 Installation and Setup

**Prerequisites:** Node.js (v20+), npm (v10+).

```sh
npm install
npm run dev      # development server
npm run build    # production build (generates the dist folder)
```

---

## 🏗 Architecture and Technical Highlights

**Friction Skill** introduced two important changes to the SHIFT codebase: the integration of the **Havok physics engine** and an architectural shift inspired by **Clean Architecture and Domain-Driven Design (DDD)**.

The project adopts a four-layer folder structure inspired by Eric Evans' DDD diagram:

```
src/
├── presentation/      — User interaction and GUI
├── application/       — High-level game logic and state coordination
├── domain/            — Physics modeling and game-specific entities
└── infrastructure/    — External tools (Havok, scene setup, optimizers)
```

* **Presentation layer:** GUI controllers, language detection, and input translation.
* **Application layer:** `GameController` coordinates initialization, pause, and reset cycles, replacing the finite state machines used in earlier simulations.
* **Domain layer:** `ObjectsController` manages the `Box` and `Plank` entities, computing the net force and adjusting μₛ and μₖ as the box advances.
* **Infrastructure layer:** `HavokPhysicsEngine` adapts the Havok library for use within Babylon.js; scene initializers and a physics debugger support development.

#### Physics Modeling

* **Havok rigid-body simulation:** The main box is a 2×2×2 dynamic cube with mass 10. Initial coefficients: μₛ = 0.7, μₖ = 0.65, restitution = 0.01.
* **Progressive parameter modulation:** As the box passes from plane to plane, the engine progressively decreases friction and increases restitution per plane index, simulating a transition from rough to slippery surfaces.
* **Net force vector visualization:** Computed every 10 frames from `body.getLinearVelocity()` differences, scaled and rotated via `Quaternion.FromUnitVectorsToRef` to display the resulting force vector in 3D.

#### A Note on the DDD Attempt

The DDD organization was ultimately limited to folder structure. The conceptual machinery of DDD — bounded contexts, aggregates, domain events, and ubiquitous language — does not naturally map to a real-time physics simulation with no business rules. This insight motivated the abandonment of DDD in subsequent simulations, in favor of a lighter MVC pattern that proved more appropriate for this domain.

Despite the limited applicability of DDD, the modular separation between physics logic and infrastructure delivered a real benefit: the simulation was completed in only **seven days** (specific development cycle), while consolidating Havok integration as a reusable technical pattern for the rest of the SHIFT series.

---

## 📸 Screenshots

<p align="center">
  <img src="image/README/1737466783770.png" width="22%" alt="Friction Skill screenshot 1" />
  <img src="image/README/1737466867120.png" width="22%" alt="Friction Skill screenshot 2" />
  <img src="image/README/1737466910692.png" width="22%" alt="Friction Skill screenshot 3" />
  <img src="image/README/1737466976742.png" width="22%" alt="Friction Skill screenshot 4" />
</p>

---

## 📜 License

### Source Code

The source code in this repository is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file.

### Visual Assets

3D models, textures, and original visual content created by the author are licensed under **Creative Commons Attribution 4.0 International (CC BY 4.0)**.

### Audio Assets

Music and sound effects in this project are sourced from [Pixabay](https://pixabay.com/) under the [Pixabay Content License](https://pixabay.com/service/license-summary/), which permits free use including for commercial purposes.

### Third-Party Libraries

* **Babylon.js** — Apache License 2.0
* **Havok Physics** — Per vendor terms (Babylon.js distribution)
* **Vite.js** — MIT License

**Copyright © 2024 Rafael João Ribeiro.**

---

## 👨‍🔬 Author

Developed by:
**Prof. Dr. Rafael João Ribeiro**
Federal Institute of Paraná (IFPR)
[www.fisicagames.com.br](https://www.fisicagames.com.br)

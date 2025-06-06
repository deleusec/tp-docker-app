# DOCKER
> Mathilde Jajolet \
> Corentin Deleuse

## Présentation

Ce projet est une application web fullstack composée de trois services distincts :
- **Frontend** : Application Vue.js (Vite)
- **Backend** : API Node.js (Express + Sequelize)
- **Base de données** : PostgreSQL

L'objectif est de démontrer l'interaction entre ces trois services via Docker.

---

## Architecture & Justification

- **Dockerisation** :
  - Chaque composant (frontend, backend, BDD) dispose de son propre Dockerfile pour garantir l'indépendance, la portabilité et la reproductibilité des environnements.
- **Orchestration avec Docker Compose** :
  - Le fichier `docker-compose.yml` orchestre le lancement des trois services, gère les réseaux, les variables d'environnement et les volumes de données.
  - Le mode `develop.watch` permet le hot reload en développement (synchronisation automatique des fichiers sources).
- **CI/CD** :
  - Un workflow GitHub Actions construit et pousse automatiquement les images Docker du frontend et du backend vers un registre Docker Hub à chaque push sur la branche principale.
- **Preuve d'interaction** :
  - Le frontend permet d'ajouter, modifier, supprimer et afficher des tâches (todo).
  - Toutes les opérations passent par l'API backend, qui lit/écrit les données dans la base PostgreSQL.
  - La preuve est visible en lançant l'application : toute action sur le frontend se répercute dans la base via le backend.

---

## Lancer le projet

1. **Cloner le repo**

2. **Lancer en mode développement (hot reload)**
   ```bash
   docker compose build
   docker compose up --build --watch
   ```
   - Frontend : http://localhost:5173
   - Backend : http://localhost:3000
   - Minio : http://localhost:9001

3. **CI/CD**
   - Les images sont automatiquement construites et poussées sur Docker Hub via GitHub Actions.

---

## Structure du projet

```
.
├── frontend/   # Application Vue.js
├── backend/    # API Express
├── docker-compose.yml
├── .github/workflows/docker-build.yml
└── README.md
```

---

## Preuve d'interaction
- Toute tâche créée/modifiée/supprimée dans le frontend est stockée en base via le backend.
- Vous pouvez vérifier dans pgAdmin ou via l'API que les données sont bien persistées.

---

## Auteurs
- Mathilde Jajolet
- Corentin Deleuse

# API Backend - Gestion de Blog

Ce projet est une API REST développée avec Node.js et Express pour gérer les articles d'un blog.

## Structure du projet
- `src/config/db.js` : Configuration SQLite3.
- `src/controllers/article.js` : Logique métier (CRUD).
- `src/routes/routes.js` : Définition des points d'entrée (Endpoints).
- `src/app.js` : Point d'entrée principal de l'application.

## Installation et Lancement
1. Installer les dépendances : `npm install`
2. Lancer le serveur : `node src/app.js`
3. Accéder à la documentation interactive : `http://localhost:3000/api-docs`

## Endpoints
- `POST /api/articles` : Créer un article.
- `GET /api/articles` : Lister tous les articles (Format JSON).
- `GET /api/articles/:id` : Voir un article spécifique.
- `PUT /api/articles/:id` : Modifier un article.
- `DELETE /api/articles/:id` : Supprimer un article.
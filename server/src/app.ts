import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import morgan from "morgan";
import path from "node:path";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", true);

app.use(
  cors({
    origin: env.CORS_ORIGIN.split(","),
    credentials: true,
  })
);

app.use("/uploads", express.static(path.resolve(env.UPLOAD_DIR)));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.use(errorHandler);

export default app;

/// ============================================================================
/// 📘 Résumé pédagogique complet — Comprendre la structure de `app.ts`
/// ----------------------------------------------------------------------------
/// 🔹 1. Objectif du fichier
///
/// Ce fichier constitue le **cœur de l’application Express**.
/// Il configure tous les **middlewares** nécessaires, monte les **routes**
/// principales, et gère les **erreurs globales**.
///
/// En pratique, c’est ici que :
/**
 * - On initialise le serveur Express.
 * - On configure la sécurité, les logs, et le traitement des requêtes.
 * - On monte les routeurs spécifiques à chaque domaine (auth, users, posts...).
 * - On termine par un middleware d’erreurs global.
 */
///
/// ----------------------------------------------------------------------------
/// 🔹 2. Ligne par ligne — explication pédagogique
///
/// ```ts
/// import express from "express";
/// ```
/// ➜ Import du framework Express : il fournit le moteur de routage et les middlewares.
///
/// ```ts
/// import cors from "cors";
/// import helmet from "helmet";
/// import cookieParser from "cookie-parser";
/// import compression from "compression";
/// import morgan from "morgan";
/// ```
/// ➜ Import de middlewares **officiels ou communautaires** :
/**
 * - `cors` → autorise les requêtes provenant d’autres domaines.
 * - `helmet` → sécurise les en-têtes HTTP (protection XSS, clickjacking...).
 * - `cookie-parser` → permet de lire les cookies envoyés par le navigateur.
 * - `compression` → compresse les réponses (gzip).
 * - `morgan` → journalise les requêtes HTTP (méthode, URL, statut, durée).
 */
///
/// ```ts
/// import { env } from "./config/env";
/// ```
/// ➜ Récupère les variables d’environnement typées (port, origine CORS, répertoire d’upload...).
///
/// ```ts
/// import authRoutes, userRoutes, postRoutes ...
/// ```
/// ➜ Importe les différents groupes de routes pour séparer la logique de l’application.
///
/// ```ts
/// import { errorHandler } from "./middlewares/error.middleware";
/// ```
/// ➜ Middleware global pour capturer et gérer toutes les erreurs Express.
///
/// ----------------------------------------------------------------------------
/// 🔹 3. Création de l’application
///
/// ```ts
/// const app = express();
/// ```
/// ➜ Initialise une **instance d’application Express**.  
/// Tous les middlewares et routes sont ensuite “branchés” sur cet objet.
///
/// ----------------------------------------------------------------------------
/// 🔹 4. Configuration des middlewares globaux
///
/// ```ts
/// app.use(helmet());
/// app.use(morgan("dev"));
/// app.use(compression());
/// app.use(express.json());
/// app.use(express.urlencoded({ extended: true }));
/// app.use(cookieParser());
/// app.set("trust proxy", true);
/// ```
/// ➜ Ces middlewares s’appliquent à **toutes les requêtes** :
/**
 * - `helmet()` : renforce la sécurité.
 * - `morgan("dev")` : trace les requêtes dans la console.
 * - `compression()` : réduit la taille des réponses HTTP.
 * - `express.json()` : parse automatiquement le corps des requêtes JSON.
 * - `express.urlencoded()` : parse les formulaires HTML (POST classiques).
 * - `cookieParser()` : lit les cookies entrants.
 * - `trust proxy` : nécessaire pour lire correctement les IP derrière un proxy (Heroku, Docker...).
 */
///
/// ----------------------------------------------------------------------------
/// 🔹 5. Configuration CORS
///
/// ```ts
/// app.use(
///   cors({
///     origin: env.CORS_ORIGIN.split(","),
///     credentials: true,
///   })
/// );
/// ```
/// ➜ Active la **politique de Cross-Origin Resource Sharing**.
/// Cela autorise les requêtes venant du frontend (`localhost:5173` par exemple).
///
/// La valeur vient de `env.CORS_ORIGIN`, qui peut contenir plusieurs origines
/// séparées par des virgules.
///
/// ----------------------------------------------------------------------------
/// 🔹 6. Fichiers statiques (uploads)
///
/// ```ts
/// app.use("/uploads", express.static(path.resolve(env.UPLOAD_DIR)));
/// ```
/// ➜ Permet de **servir les fichiers uploadés** (images, documents...) directement
/// depuis le serveur, via une URL publique comme :
/**
 * http://localhost:8080/uploads/nom_du_fichier.png
 */
///
/// ----------------------------------------------------------------------------
/// 🔹 7. Montage des routes principales
///
/// ```ts
/// app.use("/auth", authRoutes);
/// app.use("/users", userRoutes);
/// app.use("/posts", postRoutes);
/// ```
/// ➜ Chaque groupe de routes est monté sur un **préfixe d’URL** :
/**
 * - `/auth` → authentification (login, register…)
 * - `/users` → gestion des utilisateurs
 * - `/posts` → gestion des articles ou publications
 */
///
/// Cela permet une architecture claire et extensible.
///
/// ----------------------------------------------------------------------------
/// 🔹 8. Gestion globale des erreurs
///
/// ```ts
/// app.use(errorHandler);
/// ```
/// ➜ Ce middleware est placé **en dernier**, pour intercepter
/// toutes les erreurs non gérées par les routes précédentes.
/// Il renvoie une réponse JSON uniforme (statut + message d’erreur).
///
/// ----------------------------------------------------------------------------
/// 🔹 9. Export de l’application
///
/// ```ts
/// export default app;
/// ```
/// ➜ L’application Express est exportée pour être utilisée ailleurs, typiquement
/// dans un fichier `server.ts` ou `index.ts` :
/**
 * import app from "./app";
 * app.listen(env.PORT, () => console.log(`✅ Server running on port ${env.PORT}`));
 */
///
/// ----------------------------------------------------------------------------
/// 🔹 10. Objectif pédagogique
///
/// Ce fichier illustre parfaitement les **bonnes pratiques** d’un serveur Express moderne :
/**
 * ✅ Séparation des responsabilités (middlewares / routes / erreurs)
 * ✅ Sécurisation des en-têtes HTTP avec Helmet
 * ✅ Journalisation avec Morgan
 * ✅ Compression des réponses HTTP
 * ✅ Parsing intelligent du corps des requêtes
 * ✅ Gestion centralisée des erreurs
 * ✅ Configuration flexible via les variables d’environnement
 * ✅ Architecture modulaire et maintenable
 */
///
/// ----------------------------------------------------------------------------
/// 💡 En résumé :
/**
 * `app.ts` est le **cerveau de ton serveur Express** :
 * - il assemble tous les middlewares de sécurité, de parsing et de logs,
 * - il connecte les différents modules de routes,
 * - et il gère les erreurs globalement.
 *
 * ➤ Pédagogiquement :
 *   - Il démontre la composition d’une app Express moderne.
 *   - Il montre comment chaque middleware a un rôle spécifique.
 *   - Il met en pratique la modularisation du code (config, routes, middlewares).
 *   - Il illustre les notions d’architecture logicielle côté serveur.
 */
/// ============================================================================

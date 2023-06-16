# Projet SR10 P23 - Romane KULESZA, Pol CORTY

![logo](TD3/myapp/public/images/logo.png)

## Installation

```bash
cd TD3/myapp
npm install
```

## Lancement

```python
cd TD3/myapp
npm start
```

## Structure du projet

- ```TD1_Conception/``` : comprend tous les fichiers liés à la conception du site :
  - Le dossier ```Wireframe/``` contient les flows d'utilisation et les designs initiaux
  - ```DiagrammeUtilisation.png``` est notre diagramme d'utilisation
  - ```MCD:MLD.png``` est notre MCD et MLD
- ```TD2/``` : brouillon du TD2

- **```TD3/```** :
  - **```myapp/``` : répertoire du projet final**
  - ```sr10p0XX.sql``` : sauvegardes des bases de données
- ```TD4_Vue/``` : brouillon du TD4

## Éléments importants du /TD3/myapp

- ```/model``` contient tous les modèles
- ```/public/images/logo.png``` : logo de notre application
- ```/routes``` contient toutes les routes
- ```/test``` contient tous les tests unitaires Jest
- ```/views``` contient toutes les vues, catégorisées par type d'utilisateur
- ```app.js``` : script principal de notre application

---
---
---
---

# Aspects de sécurité

## 1. Usurpation de rôle d’utilisateur

Un utilisateur connecté pouvait initialement accéder à une url ne correspondant pas à son rôle : 

Par exemple un candidat qui se connecte sur l’URL ```/candidat/offersList``` peut ensuite taper manuellement l’URL ```/admin/usersList``` et y accéder.

Pour empêcher cela, nous avons une fonction ```requireCandidat``` qui se comporte comme une couche de middleware :
``` js
function requireCandidat (req, res, next) {
  if (req.session && req.session.userType === 'candidat') {
    return next()
  } else {
    res.redirect('/login')
  }
}
```
Cette fonction est appelée dans chaque route du fichier candidat :
``` js
router.get('/offersList', requireCandidat, function (req, res)
```
Le même procédé est utilisé pour les routes des recruteurs et des administrateurs.
De cette façon, un utilisateur ne peut accéder qu’aux pages correspondant à son rôle.

---

## 2. Mot de passe en clair

Initialement, notre application gérait les mots de passe en clair : dans la base de données, les mots de passe étaient gérés comme des chaines de caractères en clair.

Toute personne ayant accès à la base de donnée pouvait alors voir tous les mots de passe des utilisateurs de l’application. Un pirate récupérant un accès simplement en lecture à la base de données serait alors en mesure de faire de gros dégâts.

Pour empêcher cela, nous avons mis en place des fonctions de hash pour ne gérer que les mots de passe “hashés”.
```js
generateHash: function (plaintextPassword, callback) {
    bcrypt.hash(plaintextPassword, 10, function (err, hash) {
      // ...
      callback(hash);
    });
  },

  comparePassword: function (plaintextPassword, hash, callback) {
    bcrypt.compare(plaintextPassword, hash, function (err, result) {
      if (result)
        callback(true);
      else callback(false);
    });
  },
```
Ces fonctions sont utilisées lors de la création et de l’authentification d’un utilisateur. Le hash est donc conservé dans la base de donnée et comparé à celui du mot de passe entré lors de la connexion.

De cette façon, un hacker ne peut intercepter que le mot de passe crypté.

---

## 3. Secret et informations de connexion à la base de donnée en clair

Notre application utilise un secret pour signer les sessions, et le fichier ```db.js``` contient les identifiants de connexion à la base de données. Ces informations sont stockées en clair alors qu’elles sont très sensibles.

Un hacker peut alors trouver le fichier ```db.js``` en faisant une fouille approfondie de l’application. Si il récupère les identifiants (avec une injection de code malveillant par exemple), il aura un accès total à la base de données.

Plusieurs modifications pourraient être implémentées pour corriger cette faille :
- Chiffrer systématiquement les informations sensibles, comme pour les mots de passe
- Utiliser des variables d’environnement, avec des modules tels que dotenv
- Utiliser des mécanismes de gestion sécurisée des secrets, comme ceux proposés par AWS et Azure

Au vu de la complexité de ces solutions, nous avons décidé de ne pas les implémenter.
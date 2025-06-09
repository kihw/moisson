# L'Éternelle Moisson - Version Dockerisée 🐳

Un outil pour gérer la quête du [Dofus](http://dofus.com) Ocre pour le jeu du même nom.

## ✨ Nouvelles fonctionnalités (Branche Update)

- **Liens DofusDB** : Chaque monstre dispose maintenant d'un lien direct vers sa fiche DofusDB
- **Système de compte utilisateur** : Créez un compte pour sauvegarder votre progression en ligne
- **Synchronisation automatique** : Vos données sont synchronisées entre vos différents appareils
- **Option copier** : Cliquez sur l'icône de copie à côté de chaque nom de monstre pour le copier dans le presse-papiers
- **Application dockerisée** : Déploiement facile avec Docker
- **Interface améliorée** : Animations et feedback visuel pour la copie

## 🔗 Fonctionnalité DofusDB

Une nouvelle colonne "DofusDB" a été ajoutée à toutes les vues :
- Cliquez sur l'icône 🔗 DB à côté de chaque monstre
- S'ouvre dans un nouvel onglet vers la page DofusDB du monstre
- Permet de consulter les statistiques, sorts, et zones de drop

## 👤 Système de compte utilisateur

### Création de compte
1. Cliquez sur "S'inscrire" dans la barre de navigation
2. Choisissez un nom d'utilisateur et un mot de passe
3. Confirmez votre mot de passe
4. Votre compte est créé automatiquement

### Connexion
1. Saisissez vos identifiants dans la barre de navigation
2. Cliquez sur "Connexion"
3. Vos données sont automatiquement synchronisées

### Sauvegarde automatique
- Toute modification est automatiquement sauvegardée sur le serveur
- Changement d'état des monstres
- Modification des préférences d'affichage
- Synchronisation en temps réel

### Synchronisation manuelle
- Bouton "Synchroniser" disponible quand vous êtes connecté
- Permet de forcer une synchronisation immédiate
- Statut affiché en temps réel (✓ Synchronisé, ⚠ Erreur de sync)

## 🚀 Utilisation avec Docker

### Prérequis
- Docker installé sur votre système

### Lancement rapide
```bash
# Cloner le repository
git clone https://github.com/kihw/moisson.git
cd moisson

# Basculer sur la branche update
git checkout update

# Construire l'image Docker
docker build -t moisson .

# Lancer le conteneur
docker run -p 8080:80 moisson
```

L'application sera accessible à l'adresse : http://localhost:8080

### Avec Docker Compose
```bash
# Lancer avec docker-compose
docker-compose up -d
```

## 📋 Utilisation traditionnelle

Vous pouvez également utiliser l'application sans Docker en ouvrant simplement le fichier `index.html` dans votre navigateur.

## 💾 Sauvegarde

### Sauvegarde locale
Il est possible d'importer/exporter une sauvegarde depuis l'outil en cliquant sur le bouton `Sauvegarde`.

Une sauvegarde est une liste de numéros de monstres séparés par des virgules (exemple : `1,20,41,3`).

Les informations sont stockées en local sur le navigateur donc pas besoin de s'inscrire pour une utilisation basique.

### Sauvegarde en ligne (Nouveau)
Avec un compte utilisateur :
- Sauvegarde automatique sur serveur simulé
- Synchronisation entre appareils
- Récupération de données en cas de changement de navigateur
- Sauvegarde des préférences (tri, affichage, etc.)

**Note technique** : Dans cette version de démonstration, les données sont stockées dans le localStorage du navigateur pour simuler un serveur. En production, cela serait remplacé par une vraie API backend.

## 📊 Données

Les données ont été extraites du site [Dofus2.org](http://dofus2.org/quetes/L-Eternelle-Moisson-248.html). Merci à eux pour ce super tuto !

## 🎯 Fonctionnalités

- ✅ Suivi de progression par type de monstre (Monstres, Boss, Archimonstres)
- ✅ Organisation par zones ou par étapes
- ✅ Recherche de monstres
- ✅ Sauvegarde locale automatique
- ✅ Import/Export de sauvegardes
- ✅ **Nouveau** : Liens directs vers DofusDB pour chaque monstre
- ✅ **Nouveau** : Système de compte utilisateur avec sauvegarde en ligne
- ✅ **Nouveau** : Synchronisation automatique des données
- ✅ Copie rapide des noms de monstres
- ✅ Interface responsive
- ✅ Dockerisation pour déploiement facile

## 🔧 Architecture technique

### Frontend
- **AngularJS 1.x** : Framework principal
- **Bootstrap 3** : Interface utilisateur responsive
- **Angular-locker** : Gestion du localStorage

### Système de comptes (Simulation)
- Stockage utilisateurs dans localStorage (`moisson_users`)
- Données utilisateur dans localStorage (`moisson_user_data`)
- Simulation d'API REST avec promesses JavaScript
- Authentification par token simulé

### Intégration DofusDB
- Génération automatique d'URLs vers DofusDB
- Recherche par nom de monstre
- Ouverture dans nouvel onglet

## 🚀 Déploiement

### Développement local
```bash
# Cloner et basculer sur la branche update
git checkout update

# Ouvrir index.html dans un navigateur
# ou servir avec un serveur HTTP local
python -m http.server 8000
```

### Production avec Docker
```bash
# Build de l'image
docker build -t moisson:update .

# Déploiement
docker run -d -p 80:80 --name moisson-app moisson:update
```

## 🔮 Évolutions futures

- Backend réel avec base de données
- API REST complète
- Authentification OAuth
- Partage de progression entre joueurs
- Statistiques de progression communautaires
- Notifications push pour les événements Dofus

## 🙏 Crédits

Basé sur le projet original [Eternelle-Moisson](https://github.com/Mopolo/Eternelle-Moisson) de [Mopolo](https://github.com/Mopolo).

Nouvelles fonctionnalités développées pour améliorer l'expérience utilisateur et faciliter le suivi de la quête.

## 📄 Licence

Ce projet est distribué sous licence MIT donc vous êtes libres de le modifier/copier/distribuer.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Créer une issue pour signaler un bug
- Proposer de nouvelles fonctionnalités
- Soumettre une pull request
- Tester les nouvelles fonctionnalités de la branche `update`

### Comment contribuer aux nouvelles fonctionnalités
1. Fork le projet
2. Créer une branche depuis `update` : `git checkout -b feature/ma-fonctionnalite update`
3. Développer votre fonctionnalité
4. Tester l'intégration avec le système de comptes
5. Soumettre une pull request vers la branche `update`

---

*Dofus est la propriété d'Ankama*
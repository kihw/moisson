# L'Éternelle Moisson - Version Dockerisée 🐳

Un outil pour gérer la quête du [Dofus](http://dofus.com) Ocre pour le jeu du même nom.

## ✨ Nouvelles fonctionnalités

- **Option copier** : Cliquez sur l'icône de copie à côté de chaque nom de monstre pour le copier dans le presse-papiers
- **Application dockerisée** : Déploiement facile avec Docker
- **Interface améliorée** : Animations et feedback visuel pour la copie

## 🚀 Utilisation avec Docker

### Prérequis
- Docker installé sur votre système

### Lancement rapide
```bash
# Cloner le repository
git clone https://github.com/kihw/moisson.git
cd moisson

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

Il est possible d'importer/exporter une sauvegarde depuis l'outil en cliquant sur le bouton `Sauvegarde`.

Une sauvegarde est une liste de numéros de monstres séparés par des virgules (exemple : `1,20,41,3`).

Les informations sont stockées en local sur le navigateur donc pas besoin de s'inscrire.

## 📊 Données

Les données ont été extraites du site [Dofus2.org](http://dofus2.org/quetes/L-Eternelle-Moisson-248.html). Merci à eux pour ce super tuto !

## 🎯 Fonctionnalités

- ✅ Suivi de progression par type de monstre (Monstres, Boss, Archimonstres)
- ✅ Organisation par zones ou par étapes
- ✅ Recherche de monstres
- ✅ Sauvegarde locale automatique
- ✅ Import/Export de sauvegardes
- ✅ **Nouveau** : Copie rapide des noms de monstres
- ✅ Interface responsive
- ✅ Dockerisation pour déploiement facile

## 🙏 Crédits

Basé sur le projet original [Eternelle-Moisson](https://github.com/Mopolo/Eternelle-Moisson) de [Mopolo](https://github.com/Mopolo).

## 📄 Licence

Ce projet est distribué sous licence MIT donc vous êtes libres de le modifier/copier/distribuer.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Créer une issue pour signaler un bug
- Proposer de nouvelles fonctionnalités
- Soumettre une pull request

---

*Dofus est la propriété d'Ankama*
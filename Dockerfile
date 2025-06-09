# Utiliser une image Nginx légère
FROM nginx:alpine

# Copier les fichiers de l'application dans le répertoire de Nginx
COPY . /usr/share/nginx/html/

# Exposer le port 80
EXPOSE 80

# Nginx se lance automatiquement avec l'image alpine
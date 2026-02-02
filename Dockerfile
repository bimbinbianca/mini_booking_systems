FROM nginx:alpine

# Copy semua file project ke folder html Nginx
COPY . /usr/share/nginx/html

# Expose port 80 (web server)
EXPOSE 80
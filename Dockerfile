FROM nginx:stable-alpine
LABEL org.opencontainers.image.source="https://github.com/joakimwinum/javascript-snake"
LABEL org.opencontainers.image.licenses="MIT"
WORKDIR /usr/share/nginx/html
COPY . .

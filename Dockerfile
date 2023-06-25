FROM nginx:stable-alpine
LABEL org.opencontainers.image.source="https://github.com/joakimwinum/js-snake"
LABEL org.opencontainers.image.licenses="MIT"
WORKDIR /usr/share/nginx/html
COPY . .

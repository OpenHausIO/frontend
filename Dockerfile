FROM nginx:1.23.2-alpine

ENV NODE_ENV=production
ENV NGINX_HOSTNAME="open-haus.lan, open-haus.local"
ENV BACKEND_PROTOCOL="http"
ENV BACKEND_HOST="127.0.0.1"
ENV BACKEND_PORT="8080"
#ENV ADMIN_PROTOCOL="http"
#ENV ADMIN_HOST="127.0.0.1"
#ENV ADMIN_PORT="3001"
ENV RESOLVER="127.0.0.11"

ARG version=unknown
LABEL version=$version

ARG buildDate=unknown
LABEL buildDate=$buildDate

COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY build /usr/share/nginx/html

RUN apk --no-cache add openssl
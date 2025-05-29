FROM nginx:1.23.2-alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

ARG version=unknown
LABEL version=$version

ARG buildDate=unknown
LABEL buildDate=$buildDate

COPY build/ /usr/share/nginx/html
COPY docker-nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
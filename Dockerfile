# The instructions for the first stage
#FROM node:16-alpine as builder

#ARG NODE_ENV=production
#ENV NODE_ENV=${NODE_ENV}

#RUN apk --no-cache add python3 make g++

#COPY ./package*.json ./
#RUN npm install


# ------------------------------------


# The instructions for second stage
FROM nginx:1.23.2-alpine

COPY dist /usr/share/nginx/html
RUN apk --no-cache add openssl

ENV NODE_ENV=production
FROM node:16-alpine as builder
WORKDIR /app
COPY ./package.json .
RUN npm install
COPY . . 

ARG REACT_APP_HOSTNAME
ENV REACT_APP_HOSTNAME $REACT_APP_HOSTNAME
RUN npm run build

FROM nginx 
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
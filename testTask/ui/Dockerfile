FROM node:16 as react-build
WORKDIR /usr/src/ui
COPY . ./
RUN yarn
RUN yarn build

FROM nginx:alpine
COPY --from=react-build /usr/src/ui/build /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

COPY nginx.conf /etc/nginx/conf.d/default.conf
FROM node:22-alpine AS build

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx ng build --configuration=production

FROM nginx:1.28-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/dist/driveme-frontend/browser /usr/share/nginx/html

RUN find /usr/share/nginx/html -type d -exec chmod 755 {} \; \
    && find /usr/share/nginx/html -type f -exec chmod 644 {} \;

EXPOSE 80

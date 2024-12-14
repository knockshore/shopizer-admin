# Shopizer Administration (shopizer-admin) Angular web app

## Tested with node v12.22.7

Requires Angular cli installed (npm install -g @angular/cli@13.3.x)

# Set backend api



## Run locally

npm install --legacy-peer-deps

ng serve -o

http://localhost:4200

## Build app
ng build 

docker run -it --rm -p 8083:4200 -p 8084:3000 --add-host=host.docker.internal:host-gateway -v /f/shopizer-admin:/shopizer-admin -w /shopizer-admin node:lts-alpine3.21 npm i --legacy-peer-deps

docker run --name node12 -it --rm -p 8083:4200 --add-host=host.docker.internal:host-gateway -v /f/shopizer-admin:/shopizer-admin -w /shopizer-admin node:12.15-alpine ./node_modules/.bin/ng serve -o

https://stackoverflow.com/questions/70360870/why-is-angular-core-core-has-no-exported-member-%C9%B5%C9%B5factorydeclaration-error-t

## Run docker images

Assumes your backend runs on http://localhost:8080/api

```
docker run \
-e "APP_BASE_URL=http://localhost:9090/api" \
-it --rm -p 4200:80 shopizerecomm/shopizer-admin
```

Username: admin@shopizer.com

Password: password

FROM node:14.10.1 AS build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
# install and app dependencies
COPY package.json /app/package.json
RUN npm install
RUN npm install -g @angular/cli
# add app
COPY . /app
# start app
CMD ng serve --prod --host 0.0.0.0 --port 4200 --disable-host-check
#EXPOSE $PORT
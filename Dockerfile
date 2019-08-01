FROM node:10

RUN mkdir /tmp/app
RUN mkdir /tmp/reports

COPY . /tmp/app

WORKDIR /tmp/app

RUN npm install --save-dev

EXPOSE 8585
CMD [ "node", "app.js" ]
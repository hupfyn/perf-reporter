FROM node:10

RUN apt-get update
RUN apt-get install ffmpeg -y

RUN mkdir /tmp/app
RUN mkdir /tmp/reports
RUN mkdir /tmp/frames

COPY . /tmp/app

WORKDIR /tmp/app

RUN npm install --save-dev

EXPOSE 8585
CMD [ "node", "app.js" ]
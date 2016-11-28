FROM node:onbuild

RUN npm install -g sails
RUN chmod a+x node_modules/.bin/*

CMD sails lift --prod --port=80 --models.migrate=alter

EXPOSE 8080:80

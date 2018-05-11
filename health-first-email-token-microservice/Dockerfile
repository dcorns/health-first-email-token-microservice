FROM node:carbon
WORKDIR /
COPY . .
RUN yarn install --production
EXPOSE 8080
CMD ["node", "service.js"]
ENV SECRET the big secret!
ENV ISS healthfirst
ENV EXP 5
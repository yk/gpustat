From node:latest
MAINTAINER Yannic Kilcher
ADD server.tar.gz /home/server
RUN cd /home/server/bundle/programs/server && npm install
ENV ROOT_URL="http://cake.inf.ethz.ch"
ENV PORT="33433"
WORKDIR /home/server/bundle
CMD ["node", "main.js"]

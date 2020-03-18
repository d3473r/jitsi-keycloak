FROM iron/node
WORKDIR /app
COPY server/package*.json ./
RUN npm --prod i
COPY server .
EXPOSE 8080
CMD [ "npm", "start" ]

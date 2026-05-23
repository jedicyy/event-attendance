FROM node:20

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

# Run Vite dev server, bind to all interfaces so host can reach it
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
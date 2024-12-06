FROM node:20
WORKDIR /app
COPY frontend/ ./frontend/
COPY backend/ ./backend/
WORKDIR /app/frontend
RUN npm ci && npm run build
WORKDIR /app/backend
RUN npm ci
CMD ["npm", "start"]
FROM node:20
WORKDIR /app
COPY frontend/ ./frontend/
RUN cd frontend && npm ci && npm run build
COPY backend/ ./backend/
RUN cd backend && npm ci
WORKDIR /app/backend
CMD ["npm", "start"]
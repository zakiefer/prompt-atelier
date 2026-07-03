FROM node:24-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV PROMPT_LAB_API_PORT=8787
EXPOSE 8787

CMD ["npm", "run", "api"]

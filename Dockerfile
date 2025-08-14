# Use the official Node.js image as the base image
FROM node:21-alpine

ARG PUBLIC_URL
ARG JWT_SECRET

ENV CORS_WHITELIST=*
ENV JWT_SECRET=${JWT_SECRET:-HF8og3airs2Zju+WvwjniDl938oWzTezhyOIOBO3Isg=}
ENV PUBLIC_URL=${PUBLIC_URL:-http://127.0.0.1:8280}

#build the nececsary to deploy the app
WORKDIR /workspace

COPY frontend/ frontend/
COPY backend/ backend/

RUN cd frontend && \
    npm install && \
    npm run build && \
    rm -rf node_modules && \
    rm -rf src && \
    rm -rf public && \
    rm -rf package.json && \
    rm -rf package-lock.json

RUN cd backend && \
    npm install 

EXPOSE 3000

CMD ["node", "backend/app.js"]
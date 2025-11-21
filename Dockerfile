FROM node:22 as base
WORKDIR /front
COPY package*.json /front
EXPOSE 5173

# --- DEV STAGE ---
FROM base as dev
RUN npm install --force
COPY . . 
CMD ["npm", "run", "dev"]

# --- PRODUCTION STAGE ---
FROM base as production
# REMOVE THIS LINE: ENV NODE_ENV=production (Do not set this yet!)

# 1. Install ALL dependencies (including tsc/vite)
RUN npm install --force

# 2. Copy source code
COPY . .

# 3. Build the app (Now tsc exists!)
RUN npm run build

# 4. (Optional) Now you can remove dev dependencies to save space
RUN npm prune --production

# 5. Set environment to production for runtime
ENV NODE_ENV=production

# 6. Install serve and run
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]
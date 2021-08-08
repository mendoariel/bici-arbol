# Specify node version and Image
# Name image development( can be anything)
FROM node:14 AS development

# Specify working directory inside container
WORKDIR /thomas/src/app

# Copy package-lock.json & package.json from host to inside container working directory
COPY package*.json ./

# Install deps  inside container
RUN npm install

RUN npm run build

EXPOSE 3000


################ 
## PRODUCTION ##
# Build another iamge named production
FROM node:14 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set work dir 
WORKDIR /thomas/src/app

COPY --from=development /thomas/src/app/ .

EXPOSE 3000

# run app
CMD ["node", "dist/main"]
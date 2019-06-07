FROM node:8-alpine

RUN apk add --update --no-cache \
                            git \
                            libzmq \
                            zeromq-dev \
                            python \
                            make \
                            g++

WORKDIR /insight

# Copy orecore-node
RUN git clone --branch master --single-branch --depth 1 https://github.com/GAB5TER/orecore-node.git .

# Copy config file
COPY orecore-node.json .

ARG VERSION

# Install npm packages
RUN npm ci

# Install Insight API module
RUN bin/orecore-node install insight-api@${VERSION}

FROM node:8-alpine

LABEL maintainer="Galactrum Developers"
LABEL description="Dockerised Insight API"

WORKDIR /insight

# Copy project files
COPY --from=0 /insight/ .

EXPOSE 3001

CMD ["bin/orecore-node", "start"]

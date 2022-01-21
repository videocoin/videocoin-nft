
FROM node:latest

RUN mkdir /code

WORKDIR /code

RUN npm install -g truffle

COPY ./contracts ./contracts
COPY ./migrations ./migrations
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./truffle-config.js ./truffle-config.js
COPY ./config.json ./config.json

ENV CUSTOM_RPC ""
ENV MNENONIC ""
ENV INFURA_KEY ""
ENV NFT721_NAME ""
ENV NFT721_SYMBOL ""
ENV NFT721_ADMIN ""
ENV NFT1155_URI ""

RUN npm install

CMD ["bash"]
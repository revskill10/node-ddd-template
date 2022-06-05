FROM 420361828844.dkr.ecr.ap-southeast-1.amazonaws.com/xendit/node-16:20220120-045732-6e6015d-builder

ARG NPM_TOKEN
WORKDIR /app
COPY --chown=app:app package*.json .npmrc.example ./
RUN set -ex; \
    sed "s/NPM_TOKEN/$NPM_TOKEN/g" .npmrc.example >> .npmrc; \
    npm clean-install; \
    npm cache clean --force; \
    rm -f .npmrc;
EXPOSE 3000

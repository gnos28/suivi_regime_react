#!/bin/bash

# prune docker
docker stop $(docker ps --filter status=running --filter name=suivi_regime_react -q)
docker rm -f $(docker ps --filter status=exited -q)
docker rmi -f $(docker images suivi_regime_react* -q)
docker image prune -f

# prepare new deployment folder
mv suivi_regime_react/ old_suivi_regime_react/
git clone git@github.com:gnos28/suivi_regime_react.git
cd suivi_regime_react/
# git pull -f --rebase origin main

# récupérer les .env uploadés précédemment avec scp et les déplacer ici
mv ../dotenv/suivi_regime_react/.env.frontend frontend/.env

# build docker images
docker compose -f docker-compose.prod.yml build --no-cache

# start container
docker compose -f docker-compose.prod.yml up >~/logs/log.compose.front.$(date +"%s") 2>&1 &
disown

# delete old folder
sudo rm -Rf ~/old_suivi_regime_react/

# build next.js
# docker exec -i $(docker ps --filter status=running --filter name=front -q) buildFRONT.sh >~/logs/log.build.front.$(date +"%s") 2>&1

# build next.js
# docker exec -i $(docker ps --filter status=running --filter name=front -q) next start >~/logs/log.build.front.$(date +"%s") 2>&1 &
# disown

# NOTE: The `npm run deploy` is required if you made react changes that you want to be included in the rebuilt site
cd dev-awesome-tool; npm run deploy; cd ..; git add .; git commit -m "sync"; git push;
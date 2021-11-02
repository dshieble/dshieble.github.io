#!/bin/bash
# To push to git, run `npm run deploy` before git push
cd dev-awesome-tool; npm run deploy; cd ..; bundle exec jekyll serve

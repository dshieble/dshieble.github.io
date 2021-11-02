#!/bin/bash

# NOTE: To mess with the react components locally, cd into dev-awesome-tool and use run_locally.sh
# NOTE: To push to git, run `npm run deploy` before git push
cd dev-awesome-tool; npm run deploy; cd ..; bundle exec jekyll serve

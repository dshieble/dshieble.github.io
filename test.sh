#!/bin/bash

# Option 1: Test the react components locally
# > This is required if you want to see dynamic changes to react components
# > cd into dev-awesome-tool and use `bash run_locally.sh`


# Option 2: Test the site end-to-end
# Run the following command
cd dev-awesome-tool; npm run deploy; cd ..; bundle exec jekyll serve --watch
# > The react components are hosted at http://127.0.0.1:4000/awesome-tool/ or danshiebler.com/awesome-tool

# NOTE: To push to git, run `npm run deploy` before git push to make sure that react changes make it into the push

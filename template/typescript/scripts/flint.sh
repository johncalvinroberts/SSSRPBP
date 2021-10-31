#!/bin/bash
set -ex

eslint . --ext ts --ext tsx --ext js --fix
prettier --write .
tsc --pretty --noEmit

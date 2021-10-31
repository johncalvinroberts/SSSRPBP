#!/bin/bash

if [ -n "$(git status --porcelain)" ]; then
  echo "Git status is not clean after installing and linting. Please double check yarn.lock, and your code formatting.";
  exit 1;
else
  echo "No changes detected after running i18n string extractor";
fi
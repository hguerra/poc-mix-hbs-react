#!/bin/sh

npm run clean
npm run build:react
npm run build:replace
npm run start

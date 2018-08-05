# Frontend project for CrystalQuartz

This project contains all the client side code of the panel as long as some frontend dev tools.

## Frontend dev quick start

- `npm install` (first time only)
- `npm run watch` - starts watching and building console client side on source changes
- in separate window - `npm run dev-server` - builds and runs dev-server
- navigate to [http://localhost:3000](http://localhost:3000)

## What is the dev-server?

It is a tiny nodejs web application that acts as a development purposes backend for CrystalQuartz. The dev-server makes it easier to write and debug frontend code without compiling .NET part.

## All available `npm` scripts

- `npm run watch` - starts source code watching and rebuilds on every change
- `npm run build-debug` - builds panel in *debug* mode and save assets to `dist` directory
- `npm run build-release` - builds panel in *release* mode and save assets to `dist` directory
- `npm run build-demo` - builds static serverless panel demo that emulates Quartz.NET scheduler in browser. Saves assest to `PROJECT_ROOT/src/Artifacts/gh-pages/demo`
- `npm run build-dev-server` - builds dev-server from sources
- `npm run run-dev-server` - runs dev-server at port 3000
- `npm run dev-server` - builds and then runs dev-server
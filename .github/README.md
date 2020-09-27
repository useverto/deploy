<p align="center">
  <a href="https://verto.exchange">
    <img src="https://raw.githubusercontent.com/useverto/design/master/logo/logo_light.svg" alt="Verto logo (light version)" width="110" />
  </a>

  <h3 align="center">Verto Deploy</h3>

  <p align="center">
    CLI tool for deploying <a href="https://sapper.svelte.dev">Sapper</a> exported applications on Arweave
  </p>

  <p align="center">
    <img src="https://github.com/useverto/deploy/workflows/Build/badge.svg" alt="Build CI" />
    <img src="https://github.com/useverto/deploy/workflows/Check%20formatting/badge.svg" alt="Check formatting" />
  </p>

</p>

## About

This is a CLI tool for deploying Svelte applications written in Sapper on Arweave

> This project needs help. It does work, but it probably needs some adjustments to work with any Sapper app. It is only tested with [useverto/verto](https://github.com/useverto/verto).

## Installing

`yarn add global @verto/deploy`
or
`npm i -g @verto/deploy`

## First steps

- Before deploying, make sure that you run `sapper export --entry "your routes with spaces between them"`
- Make sure you are deploying the `__sapper__/export` directory. It won't work with anything else.

## Usage

```sh
vdeploy help
```

Shows the help menu

### Deploy a folder

```sh
vdeploy deploy --dir <Sapper project directory to deploy> --keyfile <path toArweave keyfile>
```

This deploys your Sapper project. What it does:

- Fixes links and hrefs (so it works with the arweave transaction id subfolder)
- Deploys all your files
- Creates a path manifest that links all files together **and** adds routes

### Get balance

```sh
vdeploy balance --keyfile <path toArweave keyfile>
```

Helper command: returns your arweave balance

### Get transaction status

```sh
vdeploy status <id>
```

Helper command: returns the status of the given transaction ID

## Why does this library exist?

The [arweave-deploy](https://github.com/ArweaveTeam/arweave-deploy) CLI does not work with Sapper applications. The routes are invalid and the links/hrefs also don't work. **verto-deploy** was built specifically for deploying Sapper apps.

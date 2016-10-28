Sound game
===========================

Based on [KnpLabs/Sn4k3](https://github.com/KnpLabs/Sn4k3).

#### Documentation index

* [Installation](#install)
* [Run](#run)
* [Bottlenecks](#nottlenecks)
* [Backend readme](backend/README.md)
* [Frontend readme](frontend/README.md)

# Requirements <small>(if you don't have Docker)</small>

* PHP >=7.0
* Python >=2.7 (with `pip`)
* NodeJS >=4.4 (with `npm`)

# Install

## With Docker

Just run `docker-compose build`.

## Without Docker

Execute all these commands directly from the root directory of the repository.

```bash
pip install crossbar
composer --working-dir=backend install
cd frontend
npm install
npm run build
```

# Run

## With Docker

Just execute `docker-compose up -d`

And go to `127.0.0.1:8080`.

## Without docker

You will need at least 3 terminals for this, because all apps need to be run independently.

Run Crossbar middleware instance

```bash
crossbar start --config=crossbar/config.json
```

Run the php broadcast application

```bash
php backend/broadcast.php
```

And finally execute nodejs static server

```bash
cd frontend
node server.js
```

And go to `127.0.0.1:8080`.

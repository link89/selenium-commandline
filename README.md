# selenium-commandline
Wrapper to install and start Selenium via npm

## Introduction
This tool is aim to simplify the installation and provision of [selenium-server](https://www.selenium.dev/downloads/). It only support Selenum 4.

## Installation
`npm install -g selenium-commandline`

## Quick Start

### Install Selenium Server
`selenium-cli install`

### Download Drivers
You can either download drivers manually, or use the provsion utility. To use the provision utility, a provision configuration file need to be created first.

```yaml
downloads:
  - url: https://some.storage/path/to/chromedriver
    file: chromedriver
```

Note: It doesn't support unzip compressed file automatically.

### Start Server
Before you start server, make user dirvers can be found in the global path or current working directoy.
You can use the command to start the server

`selenium-cli standalone`

And then you can find the service in `pm2` with


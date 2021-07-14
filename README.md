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

  - url: https://some.storage/path/to/geckodriver
    file: geckodriver
```

And then you can use the `selenium-cli provision config.yaml` to download drivers for you.

Note: It doesn't support unzip compressed file automatically.  
TODO: Support post download commands.

### Start Server
Before you start server, make user dirvers can be found in the global path or current working directoy.
Then you can use the following command to run standalone server:

`selenium-cli standalone`

It use `pm2` to manage the process. You can find the service in `pm2` with `pm2 ps` command.
If you didn't install `pm2` before, you need to run `npm install -g pm2` first.

You can also pass the option to selenium server by set them after the `--`, for example 

`selenium-cli standalone -- --port 5555`
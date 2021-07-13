import { download } from "./lib";
import * as fs from "fs";
import { join, sep } from "path";
import pm2 from "pm2";

const DEFAULT_DOWNLOAD_URL = 'https://selenium-release.storage.googleapis.com/4.0-beta-4/selenium-server-4.0.0-beta-4.jar';
const SELENIUM_SERVER_PATH = process.env.TEST_SELENIUM_SERVER_PATH
  || join(__dirname, sep, "..", sep, "bin", sep, "selenium-server.jar")  // NOTE: relative to dist folder

interface InstallOptions {
  force: boolean;
}

interface StartOptions {
  name: string;
}

function isInstall() {
  return fs.existsSync(SELENIUM_SERVER_PATH);
}

export async function install(downloadUrl: string = DEFAULT_DOWNLOAD_URL, opts: InstallOptions) {
  if (isInstall() && !opts.force) {
    console.log(`selenium-server has been installed, skipped.`)
    return;
  }
  console.log(`start to download: ${downloadUrl} to ${SELENIUM_SERVER_PATH}`);
  await download(downloadUrl, SELENIUM_SERVER_PATH);
}

export async function start(opts: StartOptions) {
  if (!isInstall()) {
    console.error(`Install selenium server with "selenium-cli install" first!`)
    process.exitCode = 1;
    return;
  }

  await new Promise((resolve, reject) => {
    pm2.connect((err) => {
      if (err) {
        console.error(err);
        process.exitCode = 1;
        return reject(err);
      }
      pm2.start({
        script: `java -jar ${SELENIUM_SERVER_PATH} standalone`,
        name: opts.name,
      }, (err, apps) => {
        if (err) {
          console.error(err);
          pm2.disconnect();
          process.exitCode = 1;
          return reject(err);
        }
        console.log(`success to start ${opts.name} in pm2, check detail with "pm2 show ${opts.name}"`);
        pm2.disconnect();
        resolve(apps);
      });
    });
  });
}

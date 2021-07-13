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

export async function install(downloadUrl: string = DEFAULT_DOWNLOAD_URL, opts: InstallOptions) {
  if (fs.existsSync(SELENIUM_SERVER_PATH) && !opts.force) {
    console.log(`selenium-server has been installed, skipped.`)
    return;
  }
  console.log(`start to download: ${downloadUrl}`);
  await download(downloadUrl, SELENIUM_SERVER_PATH);
}

interface StartOptions {
  name: string;
}

export async function start(opts: StartOptions) {
  await new Promise((resolve, reject) => {
    pm2.connect((err) => {
      if (err) {
        console.error(err);
        return reject(err);
      }

      pm2.start({
        script: `java -jar ${SELENIUM_SERVER_PATH} standalone`,
        name: opts.name,
      }, (err, apps) => {
        if (err) {
          console.error(err);
          pm2.disconnect();
          return reject(err);
        }
        console.log(`success to start ${opts.name} in pm2, check detail with "pm2 show ${opts.name}"`);
        pm2.disconnect();
        resolve(apps);
      });
    });
  });
}

import { downloadFile } from "./lib";
import * as fs from "fs";
import { join, sep } from "path";
import pm2 from "pm2";
import { loadProvision } from "./schema";

const DEFAULT_DOWNLOAD_URL = 'https://selenium-release.storage.googleapis.com/4.0-beta-4/selenium-server-4.0.0-beta-4.jar';
const SELENIUM_SERVER_PATH = process.env.TEST_SELENIUM_SERVER_PATH
  || join(__dirname, sep, "..", sep, "bin", sep, "selenium-server.jar")  // NOTE: relative to dist folder

interface InstallOptions {
  force: boolean;
}

interface StartOptions {
  name: string;
  dryRun: boolean;
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
  await downloadFile(downloadUrl, SELENIUM_SERVER_PATH);
}

export async function startStandalone(args: string[], opts: StartOptions) {
  if (!isInstall()) {
    console.error(`Install selenium server with "selenium-cli install" first!`)
    process.exitCode = 1;
    return;
  }

  console.log("pass though options:", args);

  if (opts.dryRun) {
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
        script: `java`,
        args: ['-jar', SELENIUM_SERVER_PATH, 'standalone', ...args],
        windowsHide: false,
        name: opts.name,
      } as any, (err, apps) => {
        if (err) {
          console.error(err);
          pm2.disconnect();
          process.exitCode = 1;
          return reject(err);
        }
        console.log(`success to start ${opts.name}, for more detail run "pm2 show ${opts.name}"`);
        pm2.disconnect();
        resolve(apps);
      });
    });
  });
}

export async function provision(configFile: string) {
  const config = loadProvision(configFile);
  for(const download of config.downloads) {
    if(fs.existsSync(download.file as string) && !config.reinstall) {
      console.log(`file ${download.file} has been downloaded, skiped.`);
      continue;
    }
    await downloadFile(download.url as string, download.file as string);
  }
}
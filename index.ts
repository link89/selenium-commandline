import { Command } from "commander";
import { install, start } from "./commands";

const BIN_PATH = __filename

const program = new Command();

program
  .command("install [downloadUrl]")
  .description("install selenium-server.jar")
  .option("-f, --force", "force reinstall selenium-server.jar", false)
  .action(install);

program
  .command("start")
  .description("start selenium standalone server in pm2")
  .option("-n, --name <string>", "name in pm2", "selenium-server")
  .action(start);


(async () => {
  await program.parseAsync(process.argv);
})();
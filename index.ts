import { Command } from "commander";
import { install, provision, startStandalone } from "./commands";

const BIN_PATH = __filename

const program = new Command();

program
  .command("install [downloadUrl]")
  .description("install selenium-server.jar")
  .option("-f, --force", "force reinstall selenium-server.jar", false)
  .action(install);

program
  .command("standalone")
  .description("start selenium standalone server in pm2")
  .option("-n, --name <string>", "name in pm2", "selenium-standalone-server")
  .option("-d, --dry-run", "print command without running", false)
  .argument('[args...]')
  .action(startStandalone);

program
  .command("provision <config>")
  .description("provision drivers according to the configuration file")
  .action(provision);

(async () => {
  await program.parseAsync(process.argv);
})();
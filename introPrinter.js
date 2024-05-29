var colors = require("colors");
const figlet = require("figlet");
const log = console.log;
const buny = require("./buny.json");

function PrintIntro() {
  log(colors.yellow(figlet.textSync(buny.name, { horizontalLayout: "full" })));
  log();
  log(colors.blue("Author: ") + colors.green(buny.author));
  log(colors.blue("Version: ") + colors.green(buny.version));
  log(colors.blue("License: ") + colors.green(buny.license));
  log(colors.blue("Network: ") + colors.green(buny.network));
  log(colors.blue("Exchange: ") + colors.green(buny.exchange));
  log(colors.blue("Description: ") + colors.green(buny.description));
  log();
}

module.exports = { PrintIntro };

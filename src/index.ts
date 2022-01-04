import { join } from 'path'
import yargs from 'yargs/yargs'
import { readFileSync, writeFileSync } from 'fs'
const chalk = require('chalk')

const packageJson = require('../package.json')

const argv = yargs(process.argv).scriptName(packageJson.name).option('s', {
  alias: 'skip-install',
  demandOption: false,
  default: false,
  describe: 'Skip structlog and rich instalation',
  type: 'boolean',
}).argv

console.log(chalk.green('\n[script] Running struclog installer!\n'))

// # Step: Install structlog and rich (optional)
if (argv['skip-install']) {
  console.log(
    chalk.yellow('\n[script] Skipping structlog and rich installation\n'),
  )
} else {
  console.log(chalk.green('\n[script] Installing structlog and rich\n'))
  const { execSync } = require('child_process')
  execSync('pipenv install structlog', { stdio: 'inherit' })
  execSync('pipenv install --dev rich', { stdio: 'inherit' })
}

// # Step: Copy structlog to current working directory
console.log(
  chalk.green(
    '\n[script] Copying structlog config to current working directory\n',
  ),
)
// ## Step: Get paths
const configFilePath = join(__dirname, '..', 'static', 'structlog.py')
const cwd = process.cwd()
const dest = join(cwd, 'structlog.py')

// ## Step: Copy file to cwd
const content = readFileSync(configFilePath, 'utf8')
writeFileSync(dest, content, 'utf8')

console.log(chalk.green('\n[script] Done!\n'))

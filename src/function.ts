export async function run_shell_command(command : string) {
    const {  exec } = require('child_process')
    let result;
    const util = require('util')
    const execProm = util.promisify(exec)
    try {
      result = await execProm(command)
    } catch (ex) {
      result = ex
    }
    if (Error[Symbol.hasInstance](result))
      return;

    return result
  }
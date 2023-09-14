// Dependencies
import { cac } from 'cac'
import { tx } from './locale/reword'

export async function main() {
  const cli = cac('reword')

  cli.command('test').action(async () => {
    console.log(await tx`Hello world!`)
  })

  cli.parse(process.argv, { run: false })

  try {
    await cli.runMatchedCommand()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

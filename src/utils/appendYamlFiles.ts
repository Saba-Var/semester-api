import { loadYamlFile } from 'utils'

export const appendYamlFiles = (
  target: {},
  directory: string,
  files: string[]
) => {
  files.forEach((file) => {
    const section = loadYamlFile(`${directory}/${file}.yaml`)
    Object.assign(target, section)
  })
}

import YAML from 'yamljs'

export const loadYamlContent = (path: string, key?: string) => {
  const yaml = YAML.load(`./src/swaggerDocs/${path}`)
  return key ? yaml[key] : yaml
}

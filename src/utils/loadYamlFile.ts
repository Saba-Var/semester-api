import YAML from 'yamljs'

export const loadYamlFile = (path: string, key?: string) => {
  try {
    const yaml = YAML.load(`./src/swaggerDocs/${path}`)
    return key ? yaml[key] : yaml
  } catch (error) {
    return {}
  }
}

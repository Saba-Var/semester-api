import YAML from 'yamljs'

export const loadYamlContent = (path: string, key?: string) => {
  try {
    const yaml = YAML.load(`./src/swaggerDocs/${path}`)
    return key ? yaml[key] : yaml
  } catch (error) {
    return {}
  }
}

import { loadYamlFile } from 'utils'
import YAML from 'yamljs'

jest.mock('yamljs')

describe('loadYamlFile function', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  test('should load YAML file and return the entire content', () => {
    const path = 'example.yaml'
    const yamlContent = { key1: 'value1', key2: 'value2' }

    const loadMock = jest
      .spyOn(YAML, 'load')
      .mockReturnValue(yamlContent as any)

    const result = loadYamlFile(path)

    expect(loadMock).toHaveBeenCalledWith('./src/swaggerDocs/example.yaml')
    expect(result).toEqual(yamlContent)

    loadMock.mockRestore()
  })

  test('should load YAML file and return the value of a specific key', () => {
    const path = 'example.yaml'
    const key = 'key1'
    const yamlContent = { key1: 'value1', key2: 'value2' }

    const loadMock = jest
      .spyOn(YAML, 'load')
      .mockReturnValue(yamlContent as any)

    const result = loadYamlFile(path, key)

    expect(loadMock).toHaveBeenCalledWith('./src/swaggerDocs/example.yaml')
    expect(result).toBe(yamlContent[key])

    loadMock.mockRestore()
  })

  test('should handle error and return an empty object', () => {
    const path = 'example.yaml'

    const loadMock = jest.spyOn(YAML, 'load').mockImplementation(() => {
      throw new Error('Failed to load YAML file')
    })

    const result = loadYamlFile(path)

    expect(loadMock).toHaveBeenCalledWith('./src/swaggerDocs/example.yaml')
    expect(result).toEqual({})

    loadMock.mockRestore()
  })
})

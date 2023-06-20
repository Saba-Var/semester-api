const generateFieldError = (fieldName: string, message: string) => {
  let errorsObject = {}

  errorsObject = {
    errors: {
      [fieldName]: message,
    },
  }

  return errorsObject
}

export default generateFieldError

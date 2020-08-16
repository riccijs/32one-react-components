import owasp from 'owasp-password-strength-test'

class validation {
  public emailAddress = (emailAddress: string) => {
    return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,12})+$/.test(emailAddress)
  }

  public minLength = (value: string, min: number) => {
    return value.length >= min
  }

  public maxLength = (value: string, max: number) => {
    return value.length <= max
  }

  public password = (password: string): string => {
    const result = owasp.test(password)
    if (result.errors.length) {
      const errors = result.errors.join(' ')
      return errors
    }
    return ''
  }
}

export default new validation()
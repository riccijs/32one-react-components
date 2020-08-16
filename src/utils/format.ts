class format {
  public alphaNumeric = (value: string): string => {
    return value.replace(/[^a-z0-9]/gi, '')
  }

  public maxChars = (value: string, max: number): string => {
    return value.substr(0, max)
  }

  public emailAddress = (emailAddress: string): string => {
    return emailAddress.replace(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, '')
  }
}

export default new format()
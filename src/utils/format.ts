const l10nUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const l10nEN = new Intl.NumberFormat('en-US')
class format {
  public formatLettersOnly = (value: string): string => value.replace(/[^A-Za-z?]/g, '')

  public alphaNumeric = (value: string): string => value.replace(/[^a-z0-9]/gi, '')

  public maxChars = (value: string, max: number): string => value.substr(0, max)

  public capitalizeFirstLetter = (value: string): string => value.charAt(0).toUpperCase() + value.substr(1)

  public emailAddress = (emailAddress: string): string => {
    return emailAddress.replace(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, '')
  }

  public currency = (value: number): string => l10nUSD.format(value)

  public currencyRound = (value: number): string => {
    const result = l10nUSD.format(value).toString()
    return result.substr(0, result.length - 3)
  }

  public number = (value: number): string => l10nEN.format(value)

  public stripNumberFormatting = (value: string): number => Number(value.replace(/[^0-9.]/g, ''))

  public stripCurrencyFormatting = (value: string): string => {
    value = value.replace('$', '')
    value = value.replace('.', '')
    let num = Number(value.replace(/[^0-9.]/g, ''))
    if (num < 10) {
      value = `0.0${num}`
    } else if (num < 100) {
      value = `0.${num}`
    } else {
      let str = num.toString()
      value = str.substr(0, str.length - 2) + '.' + str.substr(str.length - 2, 2)
    }
    return parseFloat(value).toFixed(2)
  }

  public roundNumber = (value: number, decimals: number): number => {
    return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals)
  }
}

export default new format()
class cookies {
  public set = (name: string, value: string, expiresInMilliseconds?: number) => {
    let expires 
    if (!!expiresInMilliseconds) {
      const date = new Date()
      date.setTime(date.getTime() + expiresInMilliseconds)
      expires = `expires=${date};`
    }
    document.cookie = `${name}=${value};${!!expires ? expires : ''}path/`
  }
  
  public get = (name: string) => {
    name = `${name}=`
    const decodedCookie = decodeURIComponent(document.cookie)
    const cookies = decodedCookie.split(';')
    for(let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1)
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length)
      }
    }
    return ''
  }
}

export default new cookies()
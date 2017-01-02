const myaspUrl = "http://alexandrudanpop1-001-site2.btempurl.com/"
const localUrl = "http://localhost:5000"

export const api = window.location.href.indexOf("localhost") !== -1
  ? localUrl
  : myaspUrl
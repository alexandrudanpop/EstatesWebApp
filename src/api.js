const myaspUrl = "http://li1397-248.members.linode.com"
const localUrl = "http://localhost:5000"

export const api = window.location.href.indexOf("localhost") !== -1
  ? localUrl
  : myaspUrl
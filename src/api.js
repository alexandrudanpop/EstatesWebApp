const azureUrl = "http://estatewebapi.azurewebsites.net"
const localUrl = "http://localhost:5000"

export const api = window.location.href.indexOf("localhost") !== -1
    ? localUrl
    : azureUrl
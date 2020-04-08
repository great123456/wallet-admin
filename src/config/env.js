
let API_PATH = 'http://47.100.9.215:8088/api/admin'


if (process.env.NODE_ENV === 'development') {

} else if (process.env.NODE_ENV === 'production') {
  // baseUrl = 'http://cangdu.org:8001'
}

export {
  API_PATH
}

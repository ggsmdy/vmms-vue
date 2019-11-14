import env from './env'

const DEV_URL = 'http://192.168.0.115:8000'//http://localhost:8000http://192.168.0.135:8000
const PRO_URL = 'http://localhost:8000'

export default env === 'development' ? DEV_URL : PRO_URL

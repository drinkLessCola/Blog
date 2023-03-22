export const productionBaseURL = 'https://summerblink.site/api'
export const developmentBaseURL = 'http://localhost:3000'
export const BASE_URL = process.env.NODE_ENV === 'production' ? productionBaseURL : developmentBaseURL
// export const BASE_URL = productionBaseURL

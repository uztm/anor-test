import { localStorageService } from 'shared/services'

import axios from 'axios'

export const $api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
})

$api.interceptors.request.use(
  function (config) {
    const token = localStorageService.get('access_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  function (error) {
    if (error instanceof Error) {
      return Promise.reject(error)
    }
    return Promise.reject(new Error(String(error)))
  },
)

$api.interceptors.response.use(
  function (response) {
    return response
  },
  function (error) {
    if (error.response.status === 401 && window.location.pathname !== '/auth') {
      localStorageService.remove('access_token')
      window.location.href = '/auth'
    }
    if (error instanceof Error) {
      return Promise.reject(error)
    }
    return Promise.reject(new Error(String(error)))
  },
)

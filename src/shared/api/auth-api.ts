import { $api } from '../services'
import type { AuthUserInfoDTO, LoginData, LoginDataDTO } from '../types'

const baseUrl = '/auth'

const login = (data: LoginData) =>
  $api.post<LoginDataDTO>(baseUrl + '/login', data)

const me = () => $api.get<AuthUserInfoDTO>(baseUrl + '/me')

const refreshToken = () => $api.post(baseUrl + '/refresh')

export const authApi = { login, me, refreshToken }

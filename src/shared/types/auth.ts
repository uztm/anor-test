export interface LoginData {
  username: string
  password: string
}

export interface LoginDataDTO {
  accessToken: string
}

export interface AuthUserInfoDTO {
  id?: number
  username?: string
  email?: string
  firstName?: string
  lastName?: string
  gender?: 'male' | 'female' // only two options :)
  image?: string
}

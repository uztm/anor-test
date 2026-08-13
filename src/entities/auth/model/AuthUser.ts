import type { AuthUserInfoDTO } from 'shared/types'

export class AuthUser implements AuthUserInfoDTO {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: 'male' | 'female'
  image: string

  constructor(dto: Partial<AuthUserInfoDTO>) {
    this.id = Number(dto.id)
    this.username = String(dto.username)
    this.email = String(dto.email)
    this.firstName = String(dto.firstName)
    this.lastName = String(dto.lastName)
    this.gender = dto.gender ?? 'male'
    this.image = String(dto.image)
  }
}

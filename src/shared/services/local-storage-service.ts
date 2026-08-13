type LocalStorageKeys = 'access_token' | 'collapsed_menu'

export const localStorageService = {
  get: (key: LocalStorageKeys) => localStorage.getItem(key),
  set: (key: LocalStorageKeys, value: string) =>
    localStorage.setItem(key, value),
  remove: (key: LocalStorageKeys) => localStorage.removeItem(key),
}

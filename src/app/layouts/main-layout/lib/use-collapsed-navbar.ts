import { localStorageService } from 'shared/services'

import { useState } from 'react'

export function useCollapsedNavbar() {
  const [collapsed, setCollapsed] = useState<boolean>(
    localStorageService.get('collapsed_menu') === 'true',
  )
  const handleChangeCollapsed = () => {
    setCollapsed(!collapsed)
    localStorageService.set('collapsed_menu', String(!collapsed))
  }
  return {
    collapsed,
    toggleCollapsed: handleChangeCollapsed,
  }
}

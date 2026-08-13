import type { PropsWithChildren } from 'react'
import React from 'react'

export const PrivateRoute = ({ children }: Readonly<PropsWithChildren>) => {
  // check authority
  return <React.Fragment>{children}</React.Fragment>
}

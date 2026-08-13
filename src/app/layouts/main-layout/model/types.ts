export interface IMenuItem {
  to?: string
  label: string
  icon?: React.ReactNode
  children?: IMenuItem[]
}

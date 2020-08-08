import { ReactElement } from 'react'
import { ThemeOptions } from '@material-ui/core'

export interface BodyProps {
  themeOptions?: ThemeOptions
  header?: ReactElement
  sidebar?: ReactElement
  sidebarHeader?: ReactElement
  body?: ReactElement
  footer?: ReactElement
  children?: ReactElement
}
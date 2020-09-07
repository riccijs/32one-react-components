import { ReactElement } from 'react'
import { ThemeOptions } from '@material-ui/core'

export interface BodyProps {
  themeOptions?: ThemeOptions
  header?: ReactElement
  headerBackgroundColor?: string
  headerColor?: string
  sidebar?: ReactElement
  sidebarBackgroundColor?: string
  sidebarColor?: string
  sidebarHeader?: ReactElement
  body?: ReactElement
  footer?: ReactElement
  children?: ReactElement
}
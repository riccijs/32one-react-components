import { ReactElement } from 'react'
import { ThemeOptions } from '@material-ui/core'

export interface BodyProps {
  themeOptions?: ThemeOptions
  header?: ReactElement
  headerBackgroundColor?: string
  headerColor?: string
  headerBorderColor?: string
  sidebar?: ReactElement
  sidebarBackgroundColor?: string
  sidebarColor?: string
  sidebarBorderColor?: string
  sidebarHeader?: ReactElement
  body?: ReactElement
  footer?: ReactElement
  footerBackgroundColor?: string
  footerColor?: string
  footerBorderColor?: string
  footerFixed?: boolean
  children?: ReactElement
}
import React, { cloneElement } from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import { BodyProps } from './compiler/types'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Sidebar from './components/sidebar/Sidebar'
import FrameBody from './components/body/Body'
import Frame from './components/frame/Frame'
import { defaultTheme } from './utils'

export function Body(props: BodyProps) {
  const {
    themeOptions,
    header,
    sidebar,
    sidebarHeader,
    body,
    footer,
    children,
  } = props
  
  return (
    <MuiThemeProvider theme={ createMuiTheme(themeOptions || defaultTheme) }>
      {children}
      <Frame
        sidebar={sidebar ? <Sidebar sidebarHeader={sidebarHeader}>{ cloneElement(sidebar) }</Sidebar> : void 0 }
        header={header ? <Header>{ cloneElement(header) }</Header> : void 0 }
        body={body ? <FrameBody>{ cloneElement(body) }</FrameBody> : void 0 }
        footer={footer ? <Footer>{ cloneElement(footer) }</Footer> : void 0 }
      />
    </MuiThemeProvider>
  )
}
import React, { cloneElement } from 'react'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core'
import { BodyProps } from './compiler/types'
import Header from './base-components/Header'
import Footer from './base-components/Footer'
import Sidebar from './base-components/Sidebar'
import FrameBody from './base-components/Body'
import Frame from './base-components/Frame'
import { theme } from './utils'

export * from './components'
export * from './pages'
export * from './utils'
export * from './hooks'

export function Body(props: BodyProps) {
  const {
    themeOptions,
    header,
    headerBackgroundColor,
    headerColor,
    sidebarHeader,
    sidebar,
    sidebarBackgroundColor,
    sidebarColor,
    body,
    footer,
    children,
  } = props
  
  return (
    <MuiThemeProvider theme={ createMuiTheme(themeOptions || theme) }>
      {children}
      <Frame
        sidebar={sidebar 
          ? (
            <Sidebar 
              sidebarHeader={sidebarHeader}
              backgroundColor={sidebarBackgroundColor}
              color={sidebarColor}
            >
              { cloneElement(sidebar) }
            </Sidebar>
          ) 
          : void 0 
        }
        header={header 
          ? (
            <Header
              backgroundColor={headerBackgroundColor}
              color={headerColor}
            >
              { cloneElement(header) }
            </Header>
          ) 
          : void 0 
        }
        body={body ? <FrameBody>{ cloneElement(body) }</FrameBody> : void 0 }
        footer={footer ? <Footer>{ cloneElement(footer) }</Footer> : void 0 }
      />
    </MuiThemeProvider>
  )
}
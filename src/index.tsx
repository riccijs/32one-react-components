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
    headerBorderColor,
    sidebarHeader,
    sidebar,
    sidebarBackgroundColor,
    sidebarColor,
    sidebarBorderColor,
    body,
    footer,
    footerBackgroundColor,
    footerColor,
    footerBorderColor,
    footerFixed,
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
              borderColor={sidebarBorderColor}
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
              borderColor={headerBorderColor}
            >
              { cloneElement(header) }
            </Header>
          ) 
          : void 0 
        }
        body={body ? <FrameBody>{ cloneElement(body) }</FrameBody> : void 0 }
        footer={footer 
          ? (
            <Footer 
              backgroundColor={footerBackgroundColor} 
              color={footerColor}
              borderColor={footerBorderColor}
              fixed={footerFixed}
            >
              { cloneElement(footer) }
            </Footer>
          ) : void 0 
        }
      />
    </MuiThemeProvider>
  )
}
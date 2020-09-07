import React, { ReactElement, useState, useRef, useEffect, cloneElement } from 'react'
import classnames from 'classnames'
import { makeStyles, Drawer, Toolbar, IconButton } from '@material-ui/core'
import { Menu } from '@material-ui/icons'
import useScreenDimension from '../hooks/useScreenDimension'

export interface SidebarProps {
  children: ReactElement
  sidebarHeader?: ReactElement
  backgroundColor?: string
  sidebarHeaderBackgroundColor?: string
  sidebarHeaderColor?: string
  color?: string
}

const useStyles = makeStyles(theme => ({
  drawer: {
    position: 'relative',
    height: '100vh',
    background: theme.palette.background.default,
    color: theme.palette.text.secondary,
  },
  drawerOpen: {
    width: theme.spacing(30),
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.down('xs')]: {
      width: '100vw'
    }
  },
  drawerClosed: {
    width: theme.spacing(8),
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  toolbar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    paddingLeft: theme.spacing(1),
  },
  iconButton: {
    position: 'fixed',
    zIndex: 3,
    top: theme.spacing(1),
    left: theme.spacing(1),
  },
  sidebarHeader: {
    marginLeft: theme.spacing(2) + 2,
  },
}))

const Sidebar = ({ children, sidebarHeader, backgroundColor, color }: SidebarProps) => {
  const [ isOpen, setIsOpen ] = useState(false)
  const refIsMdOrSmaller = useRef(true)
  const { breakpoints: { md } } = useScreenDimension()
  const classes = useStyles()
  const style = { backgroundColor, color }
  const handleToggleSidebar = () => setIsOpen(previousIsOpen => !previousIsOpen)
  
  useEffect(() => {
    if (md.isAboveBreakpoint && refIsMdOrSmaller.current) {
      refIsMdOrSmaller.current = false
      setIsOpen(true)
    }
    if (!md.isAboveBreakpoint && !refIsMdOrSmaller.current) {
      refIsMdOrSmaller.current = true
      setIsOpen(false)
    }
  }, [md.isAboveBreakpoint])

  return (
    <Drawer
      id="sidebar"
      variant="permanent"
      anchor="left"
      classes={{ paper: classnames(classes.drawer, isOpen ? classes.drawerOpen : classes.drawerClosed )}}
      PaperProps={{ style }}
      open
    >
      <Toolbar className={classes.toolbar} style={style}>
        <IconButton onClick={handleToggleSidebar}>
          <Menu style={style}/>
        </IconButton>
        {!!sidebarHeader ? <div className={classes.sidebarHeader} style={style}>{cloneElement(sidebarHeader, { backgroundColor, color })}</div> : null}
      </Toolbar>
      { children }
    </Drawer>
  )
}
export default Sidebar
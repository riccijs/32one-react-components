import React, { ReactElement } from 'react'
import { makeStyles } from '@material-ui/core'

interface FrameProps {
  header?: ReactElement,
  sidebar?: ReactElement,
  body?: ReactElement,
  footer?: ReactElement,
}

type ClassName = 'body' | 'header' | 'footer' | 'headerFooter'

const useStyles = makeStyles( theme => ({
  full: {
    flexGrow: 1,
    height: '100vh',
    width: '100%',
    zIndex: 1,
    overflow: 'hidden',
    position: 'fixed',
    display: 'flex',
  },
  section: {
    position: 'relative',
    height: '100vh',
    width: '100%',
    flex: 1,
    flexWrap: 'wrap',
    background: theme.palette.background.default,
    color: theme.palette.text.primary,
    overflow: 'hidden',
  },
  body: {
    height: '100%'
  },
  header: {
    height: `calc(100vh - ${theme.spacing(9) - 7}px)`
  },
  headerFooter: {
    height: `calc(100vh - ${theme.spacing(16) + 2}px)`
  },
  footer: {
    height: `calc(100vh - ${theme.spacing(9) + 1}px)`
  },
}))

const Frame = ({header, sidebar, body, footer}: FrameProps) => {
  const classes = useStyles()
  const bodyClassName = 
    !!header && !!footer 
    ? 'headerFooter' 
    : !!header 
    ? 'header' 
    : !!footer
    ? 'footer'
    : 'body'

  const renderBody = (body: ReactElement | undefined, className: ClassName ) => {
    return (
      <div className={classes[className]}>{body}</div>
    )
  }

  return (
    // This "full" container uses flex to create a
    // container for the application
    <DisplayContainer type="full">
      { sidebar }
      
      {/**
       * Display sections provide flex containers that
       * work in conjuction with the sidebar.
       */}
      <DisplayContainer id="display-main" type="section">
        { header }
        { renderBody(body, bodyClassName) }
        { footer }
      </DisplayContainer>

    </DisplayContainer>
  )
}

export interface DisplayContainerProps { 
  children: any
  type: 'full' | 'section'
  id?: string
}

function DisplayContainer({ children, type, id }: DisplayContainerProps): ReactElement {
  const classes = useStyles()
  return (
    <div id={id} className={classes[type]}>{children}</div>
  )
}

export default Frame
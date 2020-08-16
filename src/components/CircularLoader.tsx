import React, { FC } from 'react'
import { Paper, CircularProgress, makeStyles } from '@material-ui/core'

export interface CircularLoaderProps {
  isLoading: boolean
  size?: number
  fullScreen?: boolean
}

const useStyles = makeStyles((theme) => ({
  screen: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: theme.palette.background.default,
    zIndex: 5000,
    textAlign: 'center',
    borderRadius: 0,
  },
  standard: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: theme.palette.background.default,
    textAlign: 'center',
    borderRadius: 0,
  }
}))

const CircularLoader: FC<CircularLoaderProps> = ({ isLoading, size = 30, fullScreen}) => {
  const classes = useStyles()
  if (isLoading) {
    return (
      <Paper className={fullScreen ? classes.screen : classes.standard} elevation={0}>
        <CircularProgress
          size={size}
          color="primary"
          style={{
            position: 'absolute',
            left: `calc(50% - ${size / 2}px)`,
            top: `calc(50% - ${size / 2}px)`,
          }}
        />
      </Paper>
    )
  }
  return null
}

export default CircularLoader
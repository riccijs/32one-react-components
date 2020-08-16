import React, {useState, useEffect, useCallback, Dispatch, ReactElement} from 'react'
import { Alert as MuiAlert } from '@material-ui/lab'
import { makeStyles } from '@material-ui/core'

const ALERT_AUTOHIDE_DURATION = 5000

export class AlertDefaultObject {
  public error = []
  public warning = []
  public success = []
  public info = []
}

export type AlertVariants = 'error' | 'success' | 'info' | 'warning'

export interface AlertContext {
  alert: string
  variant: AlertVariants
}

export interface AlertType {
  error: string[]
  warning: string[]
  success: string[]
  info: string[]
}

export interface AlertProps {
  alert: AlertType
  setAlert: Dispatch<any>
  autoHideDuration?: number
  fixed?: boolean
}

const useStyles = makeStyles(() => ({
  alert: {
    borderRadius: 0,
  },
  alertContainerFixed: { 
    position: 'fixed', 
    top: 0, 
    zIndex: 1500, 
    width: '100%' 
  },
}))

function Alert({ alert, setAlert, autoHideDuration = ALERT_AUTOHIDE_DURATION, fixed = false}: AlertProps) {
  const [alerts, setAlerts] = useState<ReactElement[]>([])
  const classes = useStyles()
  const handleClose = useCallback((variant: AlertVariants, index: number) => setAlert((previousAlert: AlertType) => {
    const update = previousAlert[variant].filter((alert: string, key: number) => key !== index)
    previousAlert[variant] = update
    return {...previousAlert}
  }), [setAlert])
  const createAlerts = useCallback((alert, variant, key) => {
    const onClose = () => handleClose(variant, key)
    setTimeout(onClose, autoHideDuration)
    return (
      <MuiAlert 
        key={`${variant}-alert-${key}`} 
        className={classes.alert}
        severity={variant}
        onClose={onClose}
      >
        {alert}
      </MuiAlert>
    )
  }, [handleClose, autoHideDuration, classes.alert])
  const initAlerts = useCallback(() => {
    const alerts: ReactElement[] = [
      ...alert.error.map((a: string, key: number) => createAlerts(a, 'error', key)),
      ...alert.warning.map((a: string, key: number) => createAlerts(a, 'warning', key)),
      ...alert.success.map((a: string, key: number) => createAlerts(a, 'success', key)),
      ...alert.info.map((a: string, key: number) => createAlerts(a, 'info', key))
    ]
    setAlerts(alerts)
  }, [alert, createAlerts])

  useEffect(() => { initAlerts() }, [alert, initAlerts])

  if (alerts.length) {
    return (
      <div className={fixed ? classes.alertContainerFixed : void 0}>
        {alerts}
      </div>
    )
  }
  return null
}

export default Alert
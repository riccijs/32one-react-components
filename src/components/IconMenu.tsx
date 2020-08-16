import React, { Fragment, useState, ReactElement, MouseEvent } from 'react'
import { IconButton, Menu } from '@material-ui/core'

export interface IconMenuProps {
  id: string
  icon: ReactElement
  children: ReactElement | ReactElement[]
}

const IconMenu = ({ id, icon, children }: IconMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open: boolean = !!anchorEl
  
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    const { currentTarget } = event
    setAnchorEl(previousAnchorEl => !previousAnchorEl ? currentTarget : null)
  }
  return (
    <Fragment>
      <IconButton
        aria-controls={id}
        onClick={handleClick}
      >
        {icon}
      </IconButton>
      <Menu
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClick}
      >
        {children}
      </Menu>
    </Fragment>
  )
}

export interface IconMenuItemProps {
  onClick: (event: MouseEvent<HTMLElement>) => void
  children: ReactElement
}

export default IconMenu
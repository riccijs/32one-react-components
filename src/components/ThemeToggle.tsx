import React, { MouseEvent } from 'react'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import { Brightness2TwoTone, Brightness5TwoTone } from '@material-ui/icons'

export interface ThemeToggleProps {
  themeType: 'dark' | 'light'
  onToggle: (event: MouseEvent<HTMLElement>, value: any) => void
}

const ThemeToggle = ({ themeType, onToggle }: ThemeToggleProps) => {
  return (
    <ToggleButtonGroup
      value={themeType}
      exclusive
      onChange={onToggle}
      aria-label="text alignment"
    >
      <ToggleButton value="light" aria-label="light" size="small" disabled={themeType === 'light'}>
        <Brightness5TwoTone />
      </ToggleButton>
      <ToggleButton value="dark" aria-label="dark" size="small" disabled={themeType === 'dark'}>
        <Brightness2TwoTone />
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default ThemeToggle
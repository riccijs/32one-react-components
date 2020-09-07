import React, { MouseEvent } from 'react'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import { Brightness2TwoTone, Brightness5TwoTone } from '@material-ui/icons'

export interface ThemeToggleProps {
  themeType: 'dark' | 'light'
  onToggle: (event: MouseEvent<HTMLElement>, value: any) => void
  backgroundColor?: string
  color?: string
}

const ThemeToggle = ({ themeType, onToggle, backgroundColor, color }: ThemeToggleProps) => {
  const style = { backgroundColor, color }
  return (
    <ToggleButtonGroup
      value={themeType}
      exclusive
      onChange={onToggle}
      aria-label="text alignment"
    >
      <ToggleButton value="light" aria-label="light" size="small" style={style} disabled={themeType === 'light'}>
        <Brightness5TwoTone style={style} />
      </ToggleButton>
      <ToggleButton value="dark" aria-label="dark" size="small" disabled={themeType === 'dark'} style={style}>
        <Brightness2TwoTone style={style} />
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default ThemeToggle
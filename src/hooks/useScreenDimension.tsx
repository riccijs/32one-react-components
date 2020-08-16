import { useEffect, useState } from 'react'

export type Breakpoint = {
  value: number
  isBelowBreakpoint: boolean
  isAboveBreakpoint: boolean
}

export interface Breakpoints {
  xs: Breakpoint
  sm: Breakpoint
  md: Breakpoint
  lg: Breakpoint
  xl: Breakpoint
}

const useScreenDemension = () => {
  const [innerHeight, setInnerHeight] = useState(window.innerHeight)
  const [innerWidth, setInnerWidth] = useState(window.innerWidth)

  useEffect(() => {
    const set = () => {
      if (window.innerHeight !== innerHeight) setInnerHeight(window.innerHeight)
      if (window.innerWidth !== innerWidth) setInnerWidth(window.innerWidth)
    }
    window.addEventListener('resize', set)
    return () => {
      window.removeEventListener('resize', set)
    }
  })

  const createBreakpoint = (value:number, screenWidth:number) :Breakpoint => ({
    value,
    isBelowBreakpoint: screenWidth < value,
    isAboveBreakpoint: screenWidth >= value,
  })

  const breakpoints: Breakpoints = {
    xs: createBreakpoint(0, innerWidth),
    sm: createBreakpoint(600, innerWidth),
    md: createBreakpoint(960, innerWidth),    
    lg: createBreakpoint(1280, innerWidth),
    xl: createBreakpoint(1920, innerWidth),
  }
  
  return {
    innerHeight,
    innerWidth,
    breakpoints,
  }
}

export default useScreenDemension
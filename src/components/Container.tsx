import React, { ReactElement, FC, useState } from 'react'

export interface ContainerProps {
  children: any
  width: '300' | '600' | '960' | '1024' | '1280' | '1920' | 'full'
  align: 'top' | 'center' | 'full'
}

const widthCutoff: any = {
  '300': 462,
  '600': 960,
  '960': 1280,
  '1024': 1920,
  '1280': 2560,
  '1920': 3840,
}

const Container: FC<ContainerProps> = ({ children, width: inWidth, align }: ContainerProps): ReactElement => {
  const [windowInnerWidth, setWindowInnerWidth] = useState<number>(window.innerWidth)
  const minWidthAllowed = inWidth !== 'full' ? windowInnerWidth > widthCutoff[inWidth] : false
  const width = Number(inWidth)
  const style = minWidthAllowed ? { margin: `${align === 'top' ? 0 : 'auto'} calc(50vw - ${width / 2}px) auto auto`, width } : void 0
  const styleFull = {
    display: 'none',
    width: '100%',
    height: '100%',
  }
  if (inWidth !== 'full') {
    window.addEventListener('resize', () => {
      setWindowInnerWidth(window.innerWidth)
    })
  }

  return <div style={inWidth !== 'full' ? style : styleFull}>{children}</div>
}

export default Container
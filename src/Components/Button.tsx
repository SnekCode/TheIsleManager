// button component

import React from 'react'

interface IButtonProps {
  onClick?: () => void
  children?: React.ReactNode
}

export default function Button(props: IButtonProps) {
  return <button onClick={props.onClick}>{props.children}</button>
}
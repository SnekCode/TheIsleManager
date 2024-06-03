// button component

import React from 'react'

interface IButtonProps {
  onClick?: () => void
  children?: React.ReactNode
}

export default function Button(props: IButtonProps) {
  return <button style={{margin:42}} onClick={props.onClick}>{props.children}</button>
}
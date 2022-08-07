import React from 'react'
import { Navigate } from 'react-router-dom'
const token = "fsdaf"

export const PrivateLayout = ({ children }) => {
  // const { history } = children.props
  if(token) {
    return (
      <div id="wrapper">
        Header
        {children}
        footer
      </div>
    )
  }
  return (
    <Navigate to="/login" replace />
  )
}

export const PublicLayout = ({ children }) => {
  // const { history } = children.props

  if(!token) {
    return (
      <div id="wrapper">
        Header
        {children}
        footer
      </div>
    )
  }
  return (
    <Navigate to="/" replace />
  )
}
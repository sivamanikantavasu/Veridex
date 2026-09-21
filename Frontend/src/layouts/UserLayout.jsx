import React from 'react'
import AppShell from './AppShell.jsx'

export default function UserLayout({ children }) {
  return <AppShell role="user">{children}</AppShell>
}

import React, { useState } from 'react'

export default function Tabs({ tabs, defaultTab, onChange, style = {} }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.key)

  const handleChange = (key) => {
    setActive(key)
    onChange?.(key)
  }

  const activeTab = tabs.find((t) => t.key === active)

  return (
    <div style={style}>
      <div
        role="tablist"
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-subtle)',
          gap: '4px',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            role="tab"
            aria-selected={tab.key === active}
            onClick={() => handleChange(tab.key)}
            style={{
              background: 'none',
              border: 'none',
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: tab.key === active ? 600 : 400,
              color: tab.key === active ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: tab.key === active ? '2px solid var(--burgundy-500)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'color var(--transition)',
              marginBottom: '-1px',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" style={{ paddingTop: '24px' }}>
        {activeTab?.content}
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { Skeleton } from './Skeleton.jsx'
import EmptyState from './EmptyState.jsx'
import Pagination from './Pagination.jsx'

export default function Table({
  columns,
  data = [],
  loading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'Content will appear here once connected.',
  totalItems = 0,
  page = 1,
  pageSize = 20,
  onPageChange,
  onSort,
  sortKey,
  sortDir,
  onRowClick,
}) {
  return (
    <div>
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px',
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={col.sortable && onSort ? () => onSort(col.key) : undefined}
                  style={{
                    padding: '10px 16px',
                    textAlign: col.align || 'left',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }, (_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {columns.map((col) => (
                    <td key={col.key} style={{ padding: '14px 16px' }}>
                      <Skeleton height={14} width="80%" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={row.id || i}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background var(--transition)',
                  }}
                  onMouseEnter={(e) => { if (onRowClick) e.currentTarget.style.background = 'var(--bg-hover)' }}
                  onMouseLeave={(e) => { if (onRowClick) e.currentTarget.style.background = '' }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        padding: '14px 16px',
                        color: 'var(--text-primary)',
                        textAlign: col.align || 'left',
                        whiteSpace: col.noWrap ? 'nowrap' : undefined,
                      }}
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalItems > pageSize && (
        <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <Pagination page={page} totalItems={totalItems} pageSize={pageSize} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  )
}

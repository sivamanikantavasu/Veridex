import React from 'react'
import Modal from './Modal.jsx'
import Button from './Button.jsx'

export default function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = 'Confirm', confirmVariant = 'danger', loading = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth={440}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
        </>
      }
    >
      <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>{description}</p>
    </Modal>
  )
}

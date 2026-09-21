import React, { useState } from 'react'
import { Upload, ChevronRight, File } from 'lucide-react'
import AdminLayout from '../../layouts/AdminLayout.jsx'
import Card from '../../components/Card.jsx'
import Input from '../../components/Input.jsx'
import Select from '../../components/Select.jsx'
import Button from '../../components/Button.jsx'
import Stepper from '../../components/Stepper.jsx'
import Breadcrumbs from '../../components/Breadcrumbs.jsx'
import BackButton from '../../components/BackButton.jsx'
import { useAuth } from '../../routes/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'
import { createContent, uploadContentResource } from '../../api/content.js'
import ResourceViewer from '../../components/ResourceViewer.jsx'

const steps = ['Upload File', 'Metadata', 'Access Rules', 'Review & Publish']

const typeOpts = [{ value: '', label: 'Select type...' }, { value: 'book', label: 'Book' }, { value: 'journal', label: 'Academic Journal' }, { value: 'research', label: 'Research Document' }]
const accessOpts = [{ value: '', label: 'Select access...' }, { value: 'open', label: 'Open Access' }, { value: 'subscribed', label: 'Subscribed' }, { value: 'premium', label: 'Premium' }]

export default function ContentNewPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    title: '',
    author: '',
    type: 'journal',
    language: 'English',
    year: new Date().getFullYear().toString(),
    subject: '',
    accessLevel: 'subscribed',
    description: '',
    documentName: '',
    documentUrl: '',
    status: 'draft',
    readOnly: true,
    noDownload: true,
  })
  const [dragOver, setDragOver] = useState(false)
  const [fileSelected, setFileSelected] = useState(false)
  const [formError, setFormError] = useState('')
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)
  const [resourceFile, setResourceFile] = useState(null)

  const crumbs = [
    { label: 'Dashboard', href: `/Veridex/Admin/${user?.name}/${user?.email}/Home` },
    { label: 'Content', href: `/Veridex/Admin/${user?.name}/${user?.email}/Content` },
    { label: 'New' },
  ]

  const handleFileSelection = (file) => {
    const name = file?.name || 'document.pdf'
    setForm((current) => ({
      ...current,
      documentName: name,
      documentUrl: '',
    }))
    setResourceFile(file || null)
    setFileSelected(Boolean(file))
  }

  const continueStep = () => {
    if (step === 0 && !fileSelected) {
      setFormError('Please add a document or file before continuing.')
      return
    }

    setFormError('')
    setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  const handlePublish = async () => {
    if (!fileSelected) {
      setFormError('Please upload a document or file before publishing.')
      return
    }

    if (!form.title.trim() || !form.author.trim()) {
      setFormError('Title and author are required.')
      return
    }

    setFormError('')
    setPublishing(true)

    try {
      const result = await createContent({
        title: form.title,
        author: form.author,
        type: form.type || 'journal',
        status: form.status || 'draft',
        accessLevel: form.accessLevel || 'subscribed',
        subject: form.subject || 'General',
        language: form.language || 'English',
        year: form.year || String(new Date().getFullYear()),
        description: form.description || `${form.title} by ${form.author}`,
        totalPages: 120,
        coverUrl: '',
        createdAt: new Date().toISOString(),
      })

      if (!result?.success) {
        throw new Error(result?.error || 'Content could not be created.')
      }

      await uploadContentResource(result.id, resourceFile)

      setPublished(true)
      setPublishing(false)
    } catch (error) {
      setPublishing(false)
      setFormError(error?.message || 'Content could not be created. Please check the backend and try again.')
      console.error('Failed to create content', error)
    }
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: 720 }}>
        <div>
          <BackButton />
          <Breadcrumbs items={crumbs} />
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', fontWeight: 600, color: 'var(--text-primary)', margin: '12px 0 0' }}>New Content</h1>
        </div>

        <Stepper steps={steps} current={step} />

        <Card style={{ padding: '28px' }}>
          {published ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(78,159,125,0.15)', border: '1px solid rgba(78,159,125,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <ChevronRight size={28} color="var(--success)" />
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 10px' }}>Content queued for publishing</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>The item will be available once backend processing is complete.</p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Button variant="secondary" onClick={() => navigate(`/Veridex/Admin/${user?.name}/${user?.email}/Content`)}>Back to Content</Button>
                <Button onClick={() => { setStep(0); setPublished(false); setFileSelected(false) }}>Add Another</Button>
              </div>
            </div>
          ) : (
            <>
              {step === 0 && (
                <div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px' }}>Upload Document</h2>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setDragOver(false)
                      const file = e.dataTransfer.files?.[0]
                      handleFileSelection(file)
                    }}
                    style={{
                      border: `2px dashed ${dragOver ? 'var(--burgundy-500)' : 'var(--border-strong)'}`,
                      borderRadius: 'var(--radius-lg)',
                      padding: '48px 24px',
                      textAlign: 'center',
                      background: dragOver ? 'var(--burgundy-900)' : 'var(--bg-elevated)',
                      transition: 'all var(--transition)',
                      cursor: 'pointer',
                    }}
                  >
                    {fileSelected ? (
                      <>
                        <File size={32} color="var(--success)" style={{ margin: '0 auto 12px' }} />
                        <p style={{ color: 'var(--success)', fontWeight: 600, margin: 0 }}>Document selected</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0' }}>{form.documentName || 'Document ready for upload'}</p>
                      </>
                    ) : (
                      <>
                        <Upload size={32} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                        <p style={{ color: 'var(--text-primary)', fontWeight: 600, margin: '0 0 4px' }}>Drop any document or file here</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>PDFs and images preview inline; other formats can be opened or downloaded.</p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="*/*"
                      onChange={(e) => handleFileSelection(e.target.files?.[0])}
                      style={{ display: 'block', margin: '18px auto 0', maxWidth: 260 }}
                    />
                    {formError && (
                      <p style={{ color: 'var(--danger)', margin: '12px 0 0', fontSize: '12px' }}>{formError}</p>
                    )}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Metadata</h2>
                  <Input label="Title" required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
                  <Input label="Author / Editor" required value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Select label="Content type" required options={typeOpts} value={form.type} onChange={(v) => setForm((f) => ({ ...f, type: v }))} />
                    <Input label="Publication year" type="number" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Input label="Subject / Discipline" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
                    <Input label="Language" value={form.language} onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))} />
                  </div>
                  <Input label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                </div>
              )}

              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Access Rules</h2>
                  <Select label="Access level" required options={accessOpts} value={form.accessLevel} onChange={(v) => setForm((f) => ({ ...f, accessLevel: v }))} />
                  <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { key: 'readOnly', label: 'Read-only (no download, no print)' },
                      { key: 'noDownload', label: 'Disable download' },
                    ].map(({ key, label }) => (
                      <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-secondary)' }}>
                        <input type="checkbox" checked={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))} style={{ accentColor: 'var(--burgundy-500)' }} />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 20px' }}>Review & Publish</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { label: 'Title', value: form.title || '—' },
                      { label: 'Author', value: form.author || '—' },
                      { label: 'Type', value: form.type || '—' },
                      { label: 'Document', value: form.documentName || '—' },
                      { label: 'Access level', value: form.accessLevel || '—' },
                      { label: 'Year', value: form.year || '—' },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ display: 'flex', gap: '16px', padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', minWidth: 100 }}>{label}</span>
                        <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 20, padding: 12, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                    <ResourceViewer file={resourceFile} fileName={form.documentName} height={260} />
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '28px', justifyContent: 'space-between' }}>
                <Button variant="ghost" onClick={() => { setFormError(''); setStep((s) => Math.max(0, s - 1)) }} disabled={step === 0}>Back</Button>
                {step < steps.length - 1 ? (
                  <Button onClick={continueStep}>Continue</Button>
                ) : (
                  <Button onClick={handlePublish} loading={publishing}>Publish</Button>
                )}
              </div>
              {formError && step > 0 && (
                <p style={{ marginTop: '12px', color: 'var(--danger)', fontSize: '12px' }}>{formError}</p>
              )}
            </>
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}

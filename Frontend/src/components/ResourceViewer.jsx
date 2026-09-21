import React, { useEffect, useState } from 'react'
import { Download, FileText, Image as ImageIcon } from 'lucide-react'
import mammoth from 'mammoth/mammoth.browser'

function kindOf(fileName = '', contentType = '') {
  const type = contentType.toLowerCase()
  const name = fileName.toLowerCase()
  if (type.startsWith('image/') || /\.(png|jpe?g|gif|webp|bmp|svg)$/.test(name)) return 'image'
  if (type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf'
  if (type.startsWith('text/') || /\.(txt|csv|md|json|xml)$/.test(name)) return 'text'
  if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || name.endsWith('.docx')) return 'docx'
  if (type === 'application/msword' || name.endsWith('.doc')) return 'legacy-doc'
  if (type.startsWith('video/')) return 'video'
  if (type.startsWith('audio/')) return 'audio'
  return 'file'
}

export default function ResourceViewer({ file, resourceLoader, fileName = '', contentType = '', height = 520 }) {
  const [src, setSrc] = useState(file ? URL.createObjectURL(file) : '')
  const [type, setType] = useState(file?.type || contentType)
  const [name, setName] = useState(file?.name || fileName)
  const [error, setError] = useState('')
  const [docxHtml, setDocxHtml] = useState('')

  useEffect(() => {
    let active = true
    let createdUrl = ''
    const loadDocx = async (source, sourceName, sourceType) => {
      const kind = kindOf(sourceName, sourceType)
      if (kind !== 'docx') return
      try {
        const arrayBuffer = await source.arrayBuffer()
        const result = await mammoth.convertToHtml({ arrayBuffer })
        if (active) setDocxHtml(result.value)
      } catch {
        if (active) setError('This DOCX file could not be rendered.')
      }
    }

    if (file) {
      const url = URL.createObjectURL(file)
      setSrc(url); setType(file.type); setName(file.name); setError(''); setDocxHtml('')
      loadDocx(file, file.name, file.type)
      return () => URL.revokeObjectURL(url)
    }
    if (!resourceLoader) return undefined
    resourceLoader().then((resource) => {
      if (!active) return
      createdUrl = resource.url
      const resolvedName = resource.fileName || fileName
      setSrc(resource.url); setType(resource.contentType); setName(resolvedName); setError(''); setDocxHtml('')
      loadDocx(resource.blob, resolvedName, resource.contentType)
    }).catch((err) => active && setError(err.message || 'Resource could not be loaded.'))
    return () => { active = false; if (createdUrl) URL.revokeObjectURL(createdUrl) }
  }, [file, fileName, contentType])

  const kind = kindOf(name, type)
  if (error) return <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>
  if (!src) return <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading resource preview...</p>
  if (kind === 'image') return <img src={src} alt={name || 'Resource preview'} style={{ maxWidth: '100%', maxHeight: height, objectFit: 'contain', display: 'block', margin: '0 auto' }} />
  if (kind === 'pdf') return <iframe title={name || 'PDF preview'} src={`${src}#toolbar=0&view=FitH`} style={{ width: '100%', height, border: 0, background: '#fff' }} />
  if (kind === 'video') return <video controls src={src} style={{ width: '100%', maxHeight: height }} />
  if (kind === 'audio') return <audio controls src={src} style={{ width: '100%' }} />
  if (kind === 'text') return <iframe title={name || 'Text preview'} src={src} style={{ width: '100%', height, border: 0, background: '#fff' }} />
  if (kind === 'docx') {
    if (!docxHtml) return <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Rendering Word document...</p>
    return <article className="docx-preview" dangerouslySetInnerHTML={{ __html: docxHtml }} />
  }
  if (kind === 'legacy-doc') {
    return (
      <div style={{ minHeight: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>
        <FileText size={34} />
        <span>{name || 'Legacy Word document'}</span>
        <span style={{ fontSize: 12 }}>Legacy .doc files are not browser-renderable. Open or download it to view the document.</span>
        <a href={src} download={name || 'resource.doc'} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--burgundy-200)' }}>
          <Download size={15} /> Open or download file
        </a>
      </div>
    )
  }
  return (
    <div style={{ minHeight: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'var(--text-secondary)' }}>
      {kind === 'file' ? <FileText size={34} /> : <ImageIcon size={34} />}
      <span>{name || 'This file format cannot be rendered in the browser.'}</span>
      <a href={src} download={name || 'resource'} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--burgundy-200)' }}>
        <Download size={15} /> Open or download file
      </a>
    </div>
  )
}
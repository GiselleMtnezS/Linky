'use client'

import { useState, useRef, useEffect } from 'react'
import { uploadImage } from '@/lib/cloudinary'
import type { Post, PostPayload } from '@/services/posts.service'

interface CreateProps {
  mode: 'create'
  onSave: (payload: Omit<PostPayload, 'user_id' | 'position'>) => Promise<void>
  onClose: () => void
}

interface EditProps {
  mode: 'edit'
  post: Post
  onSave: (payload: Partial<PostPayload>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onClose: () => void
}

type Props = CreateProps | EditProps

export default function PostModal(props: Props) {
  const isEdit = props.mode === 'edit'
  const post = isEdit ? (props as EditProps).post : null

  const [content, setContent] = useState(post?.content ?? '')
  const [scheduledAt, setScheduledAt] = useState(
    post?.scheduled_at ? post.scheduled_at.slice(0, 16) : ''
  )
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(post?.image_url ?? null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [content])

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSave() {
    if (!content.trim()) {
      setError('Content is required')
      return
    }
    setError('')
    setSaving(true)

    let image_url = imagePreview
    if (imageFile) {
      image_url = await uploadImage(imageFile)
    }

    const payload = {
      content: content.trim(),
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      image_url,
    }

    await props.onSave(payload as any)
    props.onClose()
    setSaving(false)
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleDelete() {
    if (isEdit) {
      await (props as EditProps).onDelete(post!.id)
      props.onClose()
    }
  }

  async function handleDownload(url: string) {
    const res = await fetch(url)
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = 'image'
    a.click()
    URL.revokeObjectURL(blobUrl)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
        onClick={props.onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-modal border border-border animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border">
          <h2 className="font-display text-xl text-ink">
            {isEdit ? 'Edit post' : 'New post'}
          </h2>
          <button onClick={props.onClose} className="btn-icon" aria-label="Close">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 space-y-4">
          {/* Content textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ink-secondary uppercase tracking-wide">
              Content
            </label>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={e => { setContent(e.target.value); setError('') }}
              placeholder="What do you want to share?"
              rows={4}
              className="w-full resize-none rounded-lg border border-border bg-surface-subtle px-3.5 py-3
                text-sm text-ink placeholder:text-ink-muted leading-relaxed
                focus:outline-none focus:border-ink/30 focus:ring-2 focus:ring-ink/5
                transition-colors duration-150 overflow-hidden"
            />
            {error && (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            )}
            <p className="text-xs text-ink-muted text-right">{content.length} / 3,000</p>
          </div>

          {/* Image upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ink-secondary uppercase tracking-wide">
              Image <span className="normal-case font-normal text-ink-muted">(optional)</span>
            </label>
            {imagePreview ? (
              <div className="relative group w-full h-36 rounded-lg overflow-hidden border border-border">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDownload(imagePreview!) }}
                    className="w-7 h-7 rounded-full bg-ink/60 text-white flex items-center justify-center"
                    aria-label="Download image"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setImageFile(null); setImagePreview(null) }}
                    className="w-7 h-7 rounded-full bg-ink/60 text-white flex items-center justify-center"
                    aria-label="Remove image"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 w-full h-20 rounded-lg border border-dashed
                border-border-strong text-ink-muted text-sm cursor-pointer
                hover:border-ink/30 hover:text-ink-secondary hover:bg-surface-subtle transition-colors duration-150">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upload image
                <input type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
              </label>
            )}
          </div>

          {/* Scheduled date */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-ink-secondary uppercase tracking-wide">
              Schedule <span className="normal-case font-normal text-ink-muted">(optional)</span>
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={e => setScheduledAt(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface-subtle px-3.5 py-2.5
                text-sm text-ink focus:outline-none focus:border-ink/30 focus:ring-2 focus:ring-ink/5
                transition-colors duration-150"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 pb-5 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            {isEdit && (
              <button onClick={handleDelete} className="btn-danger">
                Delete
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={props.onClose} className="btn-ghost">
              Cancel
            </button>
            <button
              onClick={handleCopy}
              className="btn-ghost"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

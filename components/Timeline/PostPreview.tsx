'use client'

import Image from 'next/image'
import type { Post } from '@/services/posts.service'
import { useRef } from 'react'

interface Props {
  post: Post
  onEdit: (post: Post) => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst?: boolean
  isLast?: boolean
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return 'Unscheduled'
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function truncate(text: string, max = 100): string {
  return text.length > max ? text.slice(0, max).trimEnd() + '…' : text
}


export default function PostPreview({ post, onEdit, onMoveUp, onMoveDown, isFirst, isLast }: Props) {
  const dateLabel = formatDate(post.scheduled_at)
  const isScheduled = !!post.scheduled_at

  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleTouchStart() {
    longPressTimer.current = setTimeout(() => {
      onEdit(post)
    }, 500)
  }

  function handleTouchEnd() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  return (
    <div
      data-testid="post-preview"
      onDoubleClick={() => onEdit(post)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchEnd}  // cancel if user scrolls
      className="group bg-surface rounded-xl border border-border shadow-card hover:shadow-card-hover
        hover:border-border-strong transition-all duration-200 cursor-default animate-slide-up"
    >
      <div className="flex items-start gap-3 p-4">
        {/* Image thumbnail */}
        {post.image_url && (
          <div className="shrink-0 w-14 h-14 rounded-lg overflow-hidden bg-surface-muted border border-border">
            <Image
              src={post.image_url}
              alt="Post image"
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          <p className="text-sm text-ink leading-relaxed">
            {truncate(post.content)}
          </p>
          <span className={`inline-flex items-center gap-1 text-xs font-medium
            ${isScheduled
              ? 'text-brand'
              : 'text-ink-muted'
            }`}
          >
            {isScheduled ? (
              <>
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {dateLabel}
              </>
            ) : (
              dateLabel
            )}
          </span>
        </div>

        {/* Reorder controls */}
        <div className="flex flex-col gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {!isFirst && (
            <button
              onClick={onMoveUp}
              aria-label="Move up"
              className="btn-icon"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          )}
          {!isLast && (
            <button
              onClick={onMoveDown}
              aria-label="Move down"
              className="btn-icon"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { usePosts } from '@/hooks/usePosts'
import PostPreview from './PostPreview'
import PostModal from '@/components/Modal/PostModal'
import SkeletonCard from '@/components/ui/SkeletonCard'
import type { Post } from '@/services/posts.service'

interface Props {
  userId: string
  accessToken: string
  userName: string
}

export default function TimelineClient({ userId, accessToken, userName }: Props) {
  const { posts, loading, error, addPost, editPost, removePost, moveUp, moveDown } = usePosts(userId, accessToken)

  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null)
  const [activePost, setActivePost] = useState<Post | null>(null)

  function openCreate() {
    setActivePost(null)
    setModalMode('create')
  }

  function openEdit(post: Post) {
    setActivePost(post)
    setModalMode('edit')
  }

  function closeModal() {
    setModalMode(null)
    setActivePost(null)
  }

  return (
    <div className="min-h-screen bg-surface-subtle">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border">
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-display text-2xl text-ink">Linky</h1>
          <div className="flex items-center gap-3">
            <a
              href="/auth/logout"
              className="text-xs text-ink-muted hover:text-ink-secondary transition-colors duration-150"
            >
              Sign out
            </a>
          </div>
        </div>
      </header>

      {/* Timeline */}
      <main className="max-w-xl mx-auto px-4 py-6">
        {/* Greeting */}
        {/* Greeting */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-ink-secondary">
            Hey {userName.split(' ')[0]} —{' '}
            <span className="text-ink font-medium">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'} planned.
            </span>
          </p>
          <button
            onClick={openCreate}
            aria-label="Add new post"
            className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center
      hover:bg-ink/90 active:scale-95 transition-all duration-150 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 mb-4">
            Failed to load posts. Please refresh.
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="space-y-3">
            {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <div className="w-12 h-12 rounded-full bg-surface-muted flex items-center justify-center mx-auto">
              <svg className="w-5 h-5 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="text-sm text-ink-secondary">No posts yet. Hit + to add your first one.</p>
          </div>
        )}

        {/* Post list */}
        {!loading && posts.length > 0 && (
          <div className="space-y-3">
            {posts.map((post, index) => (
              <PostPreview
                key={post.id}
                post={post}
                onEdit={openEdit}
                onMoveUp={() => moveUp(index)}
                onMoveDown={() => moveDown(index)}
                isFirst={index === 0}
                isLast={index === posts.length - 1}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {modalMode === 'create' && (
        <PostModal
          mode="create"
          onSave={addPost}
          onClose={closeModal}
        />
      )}
      {modalMode === 'edit' && activePost && (
        <PostModal
          mode="edit"
          post={activePost}
          onSave={(payload) => editPost(activePost.id, payload)}
          onDelete={removePost}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

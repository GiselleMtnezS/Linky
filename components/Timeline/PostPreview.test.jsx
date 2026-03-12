import { render, screen, fireEvent } from '@testing-library/react'
import PostPreview from './PostPreview'

const mockPost = {
  id: 'post-1',
  user_id: 'auth0|test',
  content: 'This is a test post about systems thinking and the human body.',
  image_url: null,
  scheduled_at: '2026-03-15T10:00:00Z',
  position: 0,
  is_public: false,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}


describe('PostPreview', () => {
  it('renders truncated content (~100 chars)', () => {
    render(<PostPreview post={mockPost} onEdit={() => {}} onMoveUp={() => {}} onMoveDown={() => {}} />)
    expect(screen.getByText(/This is a test post/)).toBeInTheDocument()
  })

  it('renders formatted scheduled date', () => {
    render(<PostPreview post={mockPost} onEdit={() => {}} onMoveUp={() => {}} onMoveDown={() => {}} />)
    expect(screen.getByText(/Mar 15, 2026/)).toBeInTheDocument()
  })

  it('renders "Unscheduled" when no date', () => {
    render(<PostPreview post={{ ...mockPost, scheduled_at: null }} onEdit={() => {}} onMoveUp={() => {}} onMoveDown={() => {}} />)
    expect(screen.getByText('Unscheduled')).toBeInTheDocument()
  })

  it('renders image thumbnail when image_url exists', () => {
    render(<PostPreview post={{ ...mockPost, image_url: 'https://example.com/img.jpg' }} onEdit={() => {}} onMoveUp={() => {}} onMoveDown={() => {}} />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('calls onEdit when double-clicked', () => {
    const onEdit = vi.fn()
    render(<PostPreview post={mockPost} onEdit={onEdit} onMoveUp={() => {}} onMoveDown={() => {}} />)
    fireEvent.dblClick(screen.getByTestId('post-preview'))
    expect(onEdit).toHaveBeenCalledWith(mockPost)
  })

  it('calls onEdit after long press', async () => {
    vi.useFakeTimers()
    const onEdit = vi.fn()
    render(<PostPreview post={mockPost} onEdit={onEdit} onMoveUp={() => {}} onMoveDown={() => {}} />)
    fireEvent.touchStart(screen.getByTestId('post-preview'))
    vi.advanceTimersByTime(500)
    expect(onEdit).toHaveBeenCalledWith(mockPost)
    vi.useRealTimers()
  })

  it('does not call onEdit if touch ends before 500ms', () => {
    vi.useFakeTimers()
    const onEdit = vi.fn()
    render(<PostPreview post={mockPost} onEdit={onEdit} onMoveUp={() => {}} onMoveDown={() => {}} />)
    fireEvent.touchStart(screen.getByTestId('post-preview'))
    vi.advanceTimersByTime(300)
    fireEvent.touchEnd(screen.getByTestId('post-preview'))
    vi.advanceTimersByTime(300)
    expect(onEdit).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('does not call onEdit if touch moves (scroll)', () => {
    vi.useFakeTimers()
    const onEdit = vi.fn()
    render(<PostPreview post={mockPost} onEdit={onEdit} onMoveUp={() => {}} onMoveDown={() => {}} />)
    fireEvent.touchStart(screen.getByTestId('post-preview'))
    vi.advanceTimersByTime(300)
    fireEvent.touchMove(screen.getByTestId('post-preview'))
    vi.advanceTimersByTime(300)
    expect(onEdit).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('calls onMoveUp when ▲ clicked', () => {
    const onMoveUp = vi.fn()
    render(<PostPreview post={mockPost} onEdit={() => {}} onMoveUp={onMoveUp} onMoveDown={() => {}} isFirst={false} />)
    fireEvent.click(screen.getByLabelText('Move up'))
    expect(onMoveUp).toHaveBeenCalled()
  })

  it('hides ▲ when post is first', () => {
    render(<PostPreview post={mockPost} onEdit={() => {}} onMoveUp={() => {}} onMoveDown={() => {}} isFirst={true} />)
    expect(screen.queryByLabelText('Move up')).not.toBeInTheDocument()
  })

  it('hides ▼ when post is last', () => {
    render(<PostPreview post={mockPost} onEdit={() => {}} onMoveUp={() => {}} onMoveDown={() => {}} isLast={true} />)
    expect(screen.queryByLabelText('Move down')).not.toBeInTheDocument()
  })
})
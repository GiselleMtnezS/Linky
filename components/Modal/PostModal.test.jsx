import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PostModal from './PostModal'

describe('PostModal — Create Mode', () => {
  it('renders empty fields', () => {
    render(<PostModal mode="create" onSave={() => {}} onClose={() => {}} />)
    expect(screen.getByRole('textbox')).toHaveValue('')
  })

  it('shows validation error on empty save', async () => {
    render(<PostModal mode="create" onSave={() => {}} onClose={() => {}} />)
    fireEvent.click(screen.getByText('Save'))
    expect(await screen.findByText('Content is required')).toBeInTheDocument()
  })

  it('calls onSave with content when valid', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    render(<PostModal mode="create" onSave={onSave} onClose={() => {}} />)
    await userEvent.type(screen.getByRole('textbox'), 'New post content')
    fireEvent.click(screen.getByText('Save'))
    await waitFor(() => expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({ content: 'New post content' })
    ))
  })

  it('does not render Delete button', () => {
    render(<PostModal mode="create" onSave={() => {}} onClose={() => {}} />)
    expect(screen.queryByText('Delete')).not.toBeInTheDocument()
  })

  it('calls onClose when Cancel clicked', () => {
    const onClose = vi.fn()
    render(<PostModal mode="create" onSave={() => {}} onClose={onClose} />)
    fireEvent.click(screen.getByText('Cancel'))
    expect(onClose).toHaveBeenCalled()
  })
})

describe('PostModal — Edit Mode', () => {
  const mockPost = {
    id: 'post-1',
    user_id: 'auth0|test',
    content: 'Existing post content',
    image_url: null,
    scheduled_at: null,
    position: 0,
    is_public: false,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  }

  it('pre-fills content field', () => {
    render(<PostModal mode="edit" post={mockPost} onSave={() => {}} onDelete={() => {}} onClose={() => {}} />)
    expect(screen.getByRole('textbox')).toHaveValue('Existing post content')
  })

  it('renders Delete button', () => {
    render(<PostModal mode="edit" post={mockPost} onSave={() => {}} onDelete={() => {}} onClose={() => {}} />)
    expect(screen.getByText('Delete')).toBeInTheDocument()
  })

  it('calls onDelete with post id when Delete clicked', () => {
    const onDelete = vi.fn().mockResolvedValue(undefined)
    render(<PostModal mode="edit" post={mockPost} onSave={() => {}} onDelete={onDelete} onClose={() => {}} />)
    fireEvent.click(screen.getByText('Delete'))
    expect(onDelete).toHaveBeenCalledWith('post-1')
  })
})

describe('PostModal — Copy to Clipboard', () => {
  it('copies content and shows "Copied!" feedback', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) }
    })
    const mockPost = {
      id: 'post-1',
      user_id: 'auth0|test',
      content: 'Copy this text',
      image_url: null,
      scheduled_at: null,
      position: 0,
      is_public: false,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    }
    render(<PostModal mode="edit" post={mockPost} onSave={() => {}} onDelete={() => {}} onClose={() => {}} />)
    fireEvent.click(screen.getByText('Copy'))
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Copy this text')
    expect(await screen.findByText('Copied!')).toBeInTheDocument()
  })
})

describe('PostModal — Image Download', () => {
  it('renders download button when image exists', () => {
    const mockPost = {
      id: 'post-1',
      user_id: 'auth0|test',
      content: 'Post with image',
      image_url: 'https://res.cloudinary.com/test/image/upload/v1/test.jpg',
      scheduled_at: null,
      position: 0,
      is_public: false,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    }
    render(<PostModal mode="edit" post={mockPost} onSave={() => {}} onDelete={() => {}} onClose={() => {}} />)
    expect(screen.getByLabelText('Download image')).toBeInTheDocument()
  })

  it('does not render download button when no image', () => {
    const mockPost = {
      id: 'post-1',
      user_id: 'auth0|test',
      content: 'Post without image',
      image_url: null,
      scheduled_at: null,
      position: 0,
      is_public: false,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    }
    render(<PostModal mode="edit" post={mockPost} onSave={() => {}} onDelete={() => {}} onClose={() => {}} />)
    expect(screen.queryByLabelText('Download image')).not.toBeInTheDocument()
  })
})
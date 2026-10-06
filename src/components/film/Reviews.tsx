import { useMemo, useState } from 'react'
import { ThumbsUp, MessageCircle, PenLine, ChevronDown } from 'lucide-react'
import type { Review } from '../../data/types'
import { reviewsFor } from '../../data/reviews'
import { Avatar } from '../ui/Avatar'
import { Stars, StarInput } from '../ui/Rating'
import { cn } from '../../lib/cn'

export function Reviews({ filmId, fallbackScore }: { filmId: string; fallbackScore: number }) {
  const [reviews, setReviews] = useState<Review[]>(() => reviewsFor(filmId))
  const [sort, setSort] = useState<'helpful' | 'recent'>('helpful')
  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const [formOpen, setFormOpen] = useState(false)

  const average = useMemo(() => {
    if (reviews.length === 0) return fallbackScore
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
  }, [reviews, fallbackScore])

  // Distribution across 5 buckets (0–2, 2–4, … 8–10) for the summary bars.
  const distribution = useMemo(() => {
    const buckets = [0, 0, 0, 0, 0]
    reviews.forEach((r) => {
      const idx = Math.min(4, Math.floor((r.rating - 0.01) / 2))
      buckets[idx]++
    })
    return buckets
  }, [reviews])

  const sorted = useMemo(() => {
    const copy = [...reviews]
    return sort === 'helpful'
      ? copy.sort((a, b) => b.likes - a.likes)
      : copy.sort((a, b) => +new Date(b.date) - +new Date(a.date))
  }, [reviews, sort])

  function toggleLike(id: string) {
    setLiked((l) => ({ ...l, [id]: !l[id] }))
    setReviews((rs) =>
      rs.map((r) =>
        r.id === id ? { ...r, likes: r.likes + (liked[id] ? -1 : 1) } : r,
      ),
    )
  }

  function addReview(rating: number, title: string, body: string) {
    const review: Review = {
      id: `local-${Date.now()}`,
      author: 'You',
      rating,
      date: new Date().toISOString().slice(0, 10),
      title,
      body,
      likes: 0,
    }
    setReviews((rs) => [review, ...rs])
    setFormOpen(false)
  }

  return (
    <div>
      {/* Summary header */}
      <div className="grid gap-6 rounded-2xl border border-white/6 bg-ink-850/60 p-6 sm:grid-cols-[auto_1fr] sm:gap-10">
        <div className="flex flex-col items-center justify-center text-center">
          <span className="font-display text-5xl font-extrabold text-white">
            {average.toFixed(1)}
          </span>
          <span className="text-sm text-slate-400">out of 10</span>
          <Stars score={average} className="mt-2" />
          <span className="mt-2 text-xs text-slate-500">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        <div className="flex flex-col justify-center gap-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const idx = star - 1
            const count = distribution[idx]
            const pct = reviews.length ? (count / reviews.length) * 100 : 0
            return (
              <div key={star} className="flex items-center gap-3 text-xs">
                <span className="w-12 shrink-0 text-slate-400">{star * 2}/10</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-ink-700">
                  <span
                    className="block h-full rounded-full bg-linear-to-r/srgb from-gold-400 to-gold-300"
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className="w-8 shrink-0 text-right text-slate-500">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/3 p-1">
          {(['helpful', 'recent'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-colors',
                sort === s ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white',
              )}
            >
              {s === 'helpful' ? 'Most helpful' : 'Newest'}
            </button>
          ))}
        </div>
        <button
          onClick={() => setFormOpen((v) => !v)}
          className="inline-flex items-center gap-2 rounded-full bg-white/6 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/12"
        >
          <PenLine className="h-4 w-4" /> Write a review
        </button>
      </div>

      {formOpen && <ReviewForm onSubmit={addReview} onCancel={() => setFormOpen(false)} />}

      {/* Review list */}
      <div className="mt-6 space-y-4">
        {sorted.map((r) => (
          <ReviewCard
            key={r.id}
            review={r}
            liked={!!liked[r.id]}
            onLike={() => toggleLike(r.id)}
          />
        ))}
        {sorted.length === 0 && (
          <p className="rounded-2xl border border-white/6 bg-ink-850/60 px-5 py-10 text-center text-sm text-slate-400">
            No reviews yet — be the first to share your thoughts.
          </p>
        )}
      </div>
    </div>
  )
}

function ReviewCard({
  review,
  liked,
  onLike,
}: {
  review: Review
  liked: boolean
  onLike: () => void
}) {
  const [showReplies, setShowReplies] = useState(false)
  return (
    <div className="rounded-2xl border border-white/6 bg-ink-850/60 p-5">
      <div className="flex items-start gap-3">
        <Avatar name={review.author} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-sm font-semibold text-white">@{review.author}</span>
            <Stars score={review.rating} />
            <span className="text-xs text-slate-500">{review.date}</span>
          </div>
          <h4 className="mt-2 font-semibold text-white">{review.title}</h4>
          <p className="mt-1 text-sm leading-relaxed text-slate-300">{review.body}</p>

          <div className="mt-3 flex items-center gap-4 text-xs">
            <button
              onClick={onLike}
              className={cn(
                'inline-flex items-center gap-1.5 font-medium transition-colors',
                liked ? 'text-gold-300' : 'text-slate-400 hover:text-white',
              )}
            >
              <ThumbsUp className={cn('h-3.5 w-3.5', liked && 'fill-gold-300')} />
              {review.likes}
            </button>
            {review.replies && review.replies.length > 0 && (
              <button
                onClick={() => setShowReplies((v) => !v)}
                className="inline-flex items-center gap-1.5 font-medium text-slate-400 hover:text-white"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                {review.replies.length}{' '}
                {review.replies.length === 1 ? 'reply' : 'replies'}
                <ChevronDown
                  className={cn('h-3.5 w-3.5 transition-transform', showReplies && 'rotate-180')}
                />
              </button>
            )}
          </div>

          {showReplies && review.replies && (
            <div className="mt-4 space-y-3 border-l-2 border-white/6 pl-4">
              {review.replies.map((reply, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Avatar name={reply.author} size="sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">
                        @{reply.author}
                      </span>
                      <span className="text-[11px] text-slate-500">{reply.date}</span>
                    </div>
                    <p className="mt-0.5 text-sm text-slate-300">{reply.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ReviewForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (rating: number, title: string, body: string) => void
  onCancel: () => void
}) {
  const [rating, setRating] = useState(8)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (title.trim() && body.trim()) onSubmit(rating, title.trim(), body.trim())
      }}
      className="mt-6 rounded-2xl border border-gold-300/20 bg-ink-850/80 p-5"
    >
      <p className="mb-3 text-sm font-semibold text-white">Your rating</p>
      <StarInput value={rating} onChange={setRating} />
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Sum it up in a line…"
        className="mt-4 w-full rounded-xl border border-white/10 bg-white/3 px-4 py-2.5 text-sm text-white outline-hidden placeholder:text-slate-500 focus:border-gold-300/50"
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={4}
        placeholder="What did you make of it? No spoilers, please."
        className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/3 px-4 py-2.5 text-sm text-white outline-hidden placeholder:text-slate-500 focus:border-gold-300/50"
      />
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim() || !body.trim()}
          className="rounded-md bg-linear-to-b/srgb from-gold-300 to-gold-500 px-5 py-2 text-sm font-bold text-ink-950 disabled:opacity-40"
        >
          Post review
        </button>
      </div>
    </form>
  )
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TicketTier } from '../data/types'

export type RowTier = 'standard' | 'premium'

export interface SelectedSeat {
  id: string // e.g. "F7"
  row: string
  col: number
  rowTier: RowTier
  ticket: TicketTier
}

/** Price multipliers — central to the booking maths, kept in one place. */
export const ROW_TIER_MULTIPLIER: Record<RowTier, number> = {
  standard: 1,
  premium: 1.28,
}

export const TICKET_TIER: Record<
  TicketTier,
  { label: string; multiplier: number }
> = {
  adult: { label: 'Adult', multiplier: 1 },
  student: { label: 'Student', multiplier: 0.82 },
  senior: { label: 'Senior', multiplier: 0.78 },
  child: { label: 'Child', multiplier: 0.62 },
}

/** Per-seat price in GBP base units. */
export function seatPrice(basePrice: number, seat: SelectedSeat): number {
  return (
    basePrice *
    ROW_TIER_MULTIPLIER[seat.rowTier] *
    TICKET_TIER[seat.ticket].multiplier
  )
}

export interface Booking {
  ref: string
  filmId: string
  cinemaId: string
  showtimeId: string
  date: string
  time: string
  format: string
  seats: SelectedSeat[]
  /** Total in GBP base units (display converts to active currency). */
  totalGBP: number
  createdAtISO: string
  status: 'upcoming' | 'completed'
}

interface BookingState {
  // --- in-progress selection ---
  filmId?: string
  cinemaId?: string
  showtimeId?: string
  seats: SelectedSeat[]

  // --- confirmed bookings (account dashboard) ---
  history: Booking[]

  startBooking: (filmId: string, cinemaId: string, showtimeId: string) => void
  toggleSeat: (seat: Omit<SelectedSeat, 'ticket'>) => void
  setSeatTicket: (seatId: string, ticket: TicketTier) => void
  clearSeats: () => void
  resetSelection: () => void
  confirmBooking: (input: {
    filmId: string
    cinemaId: string
    showtimeId: string
    date: string
    time: string
    format: string
    seats: SelectedSeat[]
    totalGBP: number
    createdAtISO: string
    ref: string
  }) => void
}

const MAX_SEATS = 10

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      seats: [],
      history: seedHistory(),

      startBooking: (filmId, cinemaId, showtimeId) =>
        set((s) => {
          // Reset the seat selection whenever the showtime context changes.
          const sameContext =
            s.filmId === filmId &&
            s.cinemaId === cinemaId &&
            s.showtimeId === showtimeId
          return {
            filmId,
            cinemaId,
            showtimeId,
            seats: sameContext ? s.seats : [],
          }
        }),

      toggleSeat: (seat) =>
        set((s) => {
          const exists = s.seats.find((x) => x.id === seat.id)
          if (exists) {
            return { seats: s.seats.filter((x) => x.id !== seat.id) }
          }
          if (s.seats.length >= MAX_SEATS) return s
          return { seats: [...s.seats, { ...seat, ticket: 'adult' }] }
        }),

      setSeatTicket: (seatId, ticket) =>
        set((s) => ({
          seats: s.seats.map((x) =>
            x.id === seatId ? { ...x, ticket } : x,
          ),
        })),

      clearSeats: () => set({ seats: [] }),

      resetSelection: () =>
        set({ filmId: undefined, cinemaId: undefined, showtimeId: undefined, seats: [] }),

      confirmBooking: (input) =>
        set((s) => ({
          history: [
            {
              ref: input.ref,
              filmId: input.filmId,
              cinemaId: input.cinemaId,
              showtimeId: input.showtimeId,
              date: input.date,
              time: input.time,
              format: input.format,
              seats: input.seats,
              totalGBP: input.totalGBP,
              createdAtISO: input.createdAtISO,
              status: 'upcoming',
            },
            ...s.history,
          ],
          // clear the in-progress selection after a successful purchase
          filmId: undefined,
          cinemaId: undefined,
          showtimeId: undefined,
          seats: [],
        })),
    }),
    {
      name: 'lumiere-booking',
      // Don't persist the volatile in-progress selection — only history.
      partialize: (s) => ({ history: s.history }),
    },
  ),
)

/** A couple of pre-filled bookings so the account dashboard looks lived-in. */
function seedHistory(): Booking[] {
  return [
    {
      ref: 'LMR-7F4A2',
      filmId: 'f2',
      cinemaId: 'c2',
      showtimeId: 'seed-1',
      date: '2026-05-24',
      time: '20:45',
      format: '4DX',
      seats: [
        { id: 'H7', row: 'H', col: 7, rowTier: 'premium', ticket: 'adult' },
        { id: 'H8', row: 'H', col: 8, rowTier: 'premium', ticket: 'adult' },
      ],
      totalGBP: 48.64,
      createdAtISO: '2026-05-20T18:30:00.000Z',
      status: 'completed',
    },
    {
      ref: 'LMR-3C9B1',
      filmId: 'f1',
      cinemaId: 'c1',
      showtimeId: 'seed-2',
      date: '2026-06-14',
      time: '19:15',
      format: 'IMAX',
      seats: [
        { id: 'F5', row: 'F', col: 5, rowTier: 'premium', ticket: 'adult' },
        { id: 'F6', row: 'F', col: 6, rowTier: 'premium', ticket: 'student' },
        { id: 'F7', row: 'F', col: 7, rowTier: 'premium', ticket: 'child' },
      ],
      totalGBP: 51.8,
      createdAtISO: '2026-06-01T10:05:00.000Z',
      status: 'upcoming',
    },
  ]
}

import type { Review } from './types'

/** Audience reviews keyed by film id, with threaded discussion replies. */
export const reviewsByFilm: Record<string, Review[]> = {
  f1: [
    {
      id: 'r1',
      author: 'dunefan_arrakis',
      rating: 9,
      date: '2024-03-03',
      title: 'A cinematic spectacle for the ages',
      body: 'Villeneuve outdid himself. The sandworm-riding sequence in IMAX genuinely took my breath away — the whole auditorium gasped. Chalamet and Zendaya have real chemistry this time.',
      likes: 412,
      replies: [
        {
          author: 'screen_purist',
          body: 'Saw it twice in 70mm IMAX. The Giedi Prime scenes in infrared B&W are some of the best images I have ever seen on a screen.',
          date: '2024-03-04',
        },
        {
          author: 'spice_must_flow',
          body: 'Hans Zimmer’s score in Atmos is a religious experience. Worth the premium ticket alone.',
          date: '2024-03-05',
        },
      ],
    },
    {
      id: 'r2',
      author: 'slowburn_sam',
      rating: 8,
      date: '2024-03-06',
      title: 'Epic, if a touch long',
      body: 'Magnificent to look at and the politics finally click. Drags a little in the second act but the finale earns every minute.',
      likes: 96,
    },
  ],
  f2: [
    {
      id: 'r3',
      author: 'cinephile_nora',
      rating: 9,
      date: '2023-07-22',
      title: 'Nolan’s most mature film',
      body: 'A three-hour talky drama that moves like a thriller. Cillian Murphy is extraordinary — those haunted eyes carry the whole moral weight of the 20th century. The Trinity test sequence is unbearable in the best way.',
      likes: 528,
      replies: [
        {
          author: 'history_buff',
          body: 'The Strauss hearing structure is so clever. Downey Jr. deserved every award.',
          date: '2023-07-24',
        },
      ],
    },
    {
      id: 'r4',
      author: 'quietcritic',
      rating: 8,
      date: '2023-07-26',
      title: 'Dense but rewarding',
      body: 'You will miss things on a first watch. The sound design is overwhelming — see it on the biggest screen with the best sound you can find.',
      likes: 141,
    },
  ],
  f3: [
    {
      id: 'r5',
      author: 'stargazer_ade',
      rating: 10,
      date: '2014-11-09',
      title: 'It still makes me cry',
      body: 'The docking scene. The “Stay” recording. Ten years on and nothing else has matched how this film makes the cosmic feel deeply personal. A masterpiece about love and time.',
      likes: 803,
      replies: [
        {
          author: 'tars_humour_75',
          body: 'The tesseract sequence rewired my brain at 14. Watching it again as a parent destroyed me.',
          date: '2014-11-12',
        },
      ],
    },
  ],
  f5: [
    {
      id: 'r6',
      author: 'gothamnights',
      rating: 10,
      date: '2008-07-19',
      title: 'The benchmark every blockbuster chases',
      body: 'Heath Ledger’s Joker is one of the great screen performances, full stop. The pencil trick. The interrogation scene. Sixteen years later nothing in the genre touches it.',
      likes: 1204,
      replies: [
        {
          author: 'why_so_serious',
          body: 'The ferry dilemma is still the best moral set-piece in any comic-book film.',
          date: '2008-07-21',
        },
      ],
    },
  ],
  f7: [
    {
      id: 'r7',
      author: 'arthouse_anna',
      rating: 9,
      date: '2019-06-02',
      title: 'A perfect, vicious machine',
      body: 'Tonally it shapeshifts from comedy to horror without you noticing the seams. That basement reveal had the entire cinema audibly recoil. Deserved every Oscar.',
      likes: 367,
    },
  ],
  f9: [
    {
      id: 'r8',
      author: 'webhead_22',
      rating: 9,
      date: '2023-06-03',
      title: 'Every frame could be a poster',
      body: 'The most beautiful animated film I have ever seen — each universe has its own art style. Gwen’s watercolour world is jaw-dropping. The cliffhanger is brutal though.',
      likes: 289,
      replies: [
        {
          author: 'spidersociety',
          body: 'Spot went from joke villain to genuinely terrifying. The animation team are wizards.',
          date: '2023-06-05',
        },
      ],
    },
  ],
  f10: [
    {
      id: 'r9',
      author: 'midnight_meg',
      rating: 8,
      date: '2022-03-05',
      title: 'Gotham as noir detective story',
      body: 'Pattinson’s Batman is a brooding, bruised loner and it works. Rain-soaked, grimy and genuinely scary in places — the Riddler is terrifying. A bit long but I was never bored.',
      likes: 174,
    },
  ],
}

export function reviewsFor(filmId: string): Review[] {
  return reviewsByFilm[filmId] ?? []
}

/** Average of submitted reviews (falls back to the film's aggregate score). */
export function averageReviewScore(filmId: string, fallback: number): number {
  const list = reviewsFor(filmId)
  if (list.length === 0) return fallback
  return list.reduce((sum, r) => sum + r.rating, 0) / list.length
}

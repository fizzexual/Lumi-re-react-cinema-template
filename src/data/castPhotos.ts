/**
 * Real TMDB actor headshots, keyed by actor name (must match the names used in
 * films.ts cast). Sourced from themoviedb.org. Missing names fall back to a
 * generated portrait in <CastPortrait/>.
 */
const B = 'https://image.tmdb.org/t/p/w342/'

export const castPhotos: Record<string, string> = {
  // Dune films
  'Timothée Chalamet': B + 'dFxpwRpmzpVfP1zjluH68DeQhyj.jpg',
  Zendaya: B + 'yCpzzMJ9gS7Rp7xgrVOsntW1m7D.jpg',
  'Rebecca Ferguson': B + 'lJloTOheuQSirSLXNA3JHsrMNfH.jpg',
  'Javier Bardem': B + 'p5xjCovj1uzvA2SXrWLH78Nh1Jf.jpg',
  'Josh Brolin': B + 'sX2etBbIkxRaCsATyw5ZpOVMPTD.jpg',
  'Oscar Isaac': B + 'dW5U5yrIIPmMjRThR9KT2xH6nTz.jpg',
  'Jason Momoa': B + '3troAR6QbSb6nUFMDu61YCCWLKa.jpg',
  'Stellan Skarsgård': B + 'mW7xmtGV4y79kQGn0zkKVGDMAmw.jpg',

  // Oppenheimer
  'Cillian Murphy': B + '2lKs67r7FI4bPu0AXxMUJZxmUXn.jpg',
  'Emily Blunt': B + '5nCSG5TL1bP1geD8aaBfaLnLLCD.jpg',
  'Matt Damon': B + 'At3JgvaNeEN4Z4ESKlhhes85Xo3.jpg',
  'Robert Downey Jr.': B + '5qHNjhtjMD4YWH3UP0rm4tKwxCL.jpg',
  'Florence Pugh': B + 'wcDXv5Oc8w01QfxJMla96xIDROT.jpg',

  // Interstellar
  'Matthew McConaughey': B + 'lCySuYjhXix3FzQdS4oceDDrXKI.jpg',
  'Anne Hathaway': B + 'nbccV2pMoyLTCeg5DQip24Eq0Jp.jpg',
  'Jessica Chastain': B + 'eQKnihReJeB9vQEa5gySzAlKfZt.jpg',
  'Michael Caine': B + 'bVZRMlpjTAO2pJK6v90buFgVbSW.jpg',
  'Casey Affleck': B + '304ilSygaCRWykoBWAL67TOw8g9.jpg',

  // Inception
  'Leonardo DiCaprio': B + 'mkdRcVIQl4WZhDf1vXKWTD7HZrZ.jpg',
  'Joseph Gordon-Levitt': B + 'z2FA8js799xqtfiFjBTicFYdfk.jpg',
  'Elliot Page': B + 'nXO8DE4biVXY4UDYP0NdIY1zvXS.jpg',
  'Tom Hardy': B + 'd81K0RH8UX7tZj49tZaQhZ9ewH.jpg',
  'Ken Watanabe': B + 'psAXOYp9SBOXvg6AXzARDedNQ9P.jpg',

  // The Dark Knight
  'Christian Bale': B + '7Pxez9J8fuPd2Mn9kex13YALrCQ.jpg',
  'Heath Ledger': B + '4CvsOS5Z9aAChe4lNLWCcCADpaE.jpg',
  'Aaron Eckhart': B + 'u5JjnRMr9zKEVvOP7k3F6gdcwT6.jpg',
  'Maggie Gyllenhaal': B + 'vsfkWdYWmA9CpzMHTJzrFxlDnEZ.jpg',

  // Blade Runner 2049
  'Ryan Gosling': B + 'lyUyVARQKhGxaxy0FbPJCQRpiaW.jpg',
  'Harrison Ford': B + 'pjBMJVPpcZK23Vt1nzr1zEBTWrP.jpg',
  'Ana de Armas': B + 'tkBWBvcLTihUcVf6iwbMQTFqEEv.jpg',
  'Dave Bautista': B + 'snk6JiXOOoRjPtHU5VMoy6qbd32.jpg',
  'Robin Wright': B + 'd3rIv0y2p0jMsQ7ViR7O1606NZa.jpg',

  // Parasite
  'Song Kang-ho': B + 'kBM9UTPYXUA2RNk210DXhztLFns.jpg',
  'Lee Sun-kyun': B + 'nHFBbSFohzOUOvMxPVwe3Es2nJw.jpg',
  'Cho Yeo-jeong': B + '5MgWM8pkUiYkj9MEaEpO0Ir1FD9.jpg',
  'Choi Woo-shik': B + 'hRDiuKWwe156zRjEu826eci7H3r.jpg',
  'Park So-dam': B + 'fGVOikpvivopeATDy6ZzLdKYXDu.jpg',

  // Everything Everywhere All at Once
  'Michelle Yeoh': B + 'i6fHvGt7Rb8oVyjjdQVV6vEHB94.jpg',
  'Stephanie Hsu': B + '8gb3lfIHKQAGOQyeC4ynQPsCiHr.jpg',
  'Ke Huy Quan': B + 'iestHyn7PLuVowj5Jaa1SGPboQ4.jpg',
  'Jamie Lee Curtis': B + 'eWKubKAAssRzmFwCZKh1mdYqGCH.jpg',
  'James Hong': B + 'v3lfw5aHOy0paOCx6WHiSnwzbH0.jpg',

  // Spider-Man: Across the Spider-Verse
  'Shameik Moore': B + 'ovUKfVOwJ7CadEHaG3NDsfA5xRq.jpg',
  'Hailee Steinfeld': B + '4K2dzM3odGiVZOQOD6RjVxNq2ZQ.jpg',
  'Brian Tyree Henry': B + '2MsJh0bpyzwvOUnXOltHp3j85Pb.jpg',
  'Jake Johnson': B + '3UNfW2qZgRkW81neNVfQvaRC92K.jpg',

  // The Batman
  'Robert Pattinson': B + '3qZ09UE7lN6AtorfXFRYpEtSY93.jpg',
  'Zoë Kravitz': B + 'n0mhAgmY6eJQmA7kaugsTZEJgHo.jpg',
  'Paul Dano': B + 'aoMS5ITUgDfLyHIyjes7BO9oCIz.jpg',
  'Colin Farrell': B + '5FdalJbrbZ5UCsED5rFrXpvbqJa.jpg',
  'Jeffrey Wright': B + 'yGcuHGW4glqRpOPxgiCvjcren7F.jpg',

  // Top Gun: Maverick
  'Tom Cruise': B + 'p17SLq4wabXwIYyjXF1Wf5cNnAm.jpg',
  'Miles Teller': B + 'kDf3sW3USjEBDQ3Ua7lbwOfwty6.jpg',
  'Jennifer Connelly': B + 'wdmcJagSRJ65AuJ4IUCzuHAdvgy.jpg',
  'Jon Hamm': B + 'mrXE5fZbEDPc7BEE5G21J6qrwzi.jpg',
  'Glen Powell': B + 'fUnIaJkdgvQTztyR1nLeUceSzly.jpg',

  // Poor Things
  'Emma Stone': B + 'cZ8a3QvAnj2cgcgVL6g4XaqPzpL.jpg',
  'Mark Ruffalo': B + '5GilHMOt5PAQh6rlUKZzGmaKEI7.jpg',
  'Willem Dafoe': B + 'ui8e4sgZAwMPi3hzEO53jyBJF9B.jpg',
  'Ramy Youssef': B + 'uLQWOoq11TKqnLfJBu90aKEGj8O.jpg',
  'Christopher Abbott': B + 'qWmlTycQb3yXaGhxPb6LCyaDjqh.jpg',

  // Get Out
  'Daniel Kaluuya': B + 'jj2kZqJobjom36wlhlYhc38nTwN.jpg',
  'Allison Williams': B + '5Jy9HELKS1OYg7moRl8870OSfJq.jpg',
  'Catherine Keener': B + 'n4CTwGszs6cwS1wJRlDQ5Mlh7Ex.jpg',
  'Bradley Whitford': B + 'oeDv2qZWTxELLaNtOIoeG72leNY.jpg',
  'Caleb Landry Jones': B + '8M5lPHrERwAIfWK56RkH30FOjhV.jpg',

  // Gladiator II
  'Paul Mescal': B + 'vrzZ41TGNAFgfmZjC2sOJySzBLd.jpg',
  'Denzel Washington': B + 'jj2Gcobpopokal0YstuCQW0ldJ4.jpg',
  'Pedro Pascal': B + '9VYK7oxcqhjd5LAH6ZFJ3XzOlID.jpg',
  'Connie Nielsen': B + 'gSQ3O3PJ6ly6nT63joOtfZyscFP.jpg',
  'Joseph Quinn': B + 'zshhuioZaH8S5ZKdMcojzWi1ntl.jpg',

  // Wicked
  'Cynthia Erivo': B + 'gIAXqZwZCBqkh2ppfAV4xcnMxki.jpg',
  'Ariana Grande': B + 'lV6oZ4gaylWKa3GKzNoyar65HyO.jpg',
  'Jonathan Bailey': B + 'i9m6JsYKQot3kbMMFsvbEuFarvq.jpg',
  'Jeff Goldblum': B + 'kcyEPgYtBP5Pm6LLeLGfXKjYovL.jpg',

  // Furiosa
  'Anya Taylor-Joy': B + 'jxAbDJWvz4p1hoFpJYG5vY2dQmq.jpg',
  'Chris Hemsworth': B + 'piQGdoIQOF3C1EI5cbYZLAW1gfj.jpg',
  'Tom Burke': B + '4IHlAZ9bJ82VAd6HUOWFgo81SDq.jpg',
  'Alyla Browne': B + 'h9qYvAqEZS6HTQhE8zLA0q3u52n.jpg',
  'George Shevtsov': B + 'cuOoCZShfvNrOvrWqH2dPyBfrZS.jpg',

  // Nosferatu
  'Lily-Rose Depp': B + 'fulxfCO2UjDTVX3lhy4mup4wXqM.jpg',
  'Nicholas Hoult': B + 'qjdDsrJCx9wgrXDTc7TwZiPn9OC.jpg',
  'Bill Skarsgård': B + 'xBXLx1m0uzhXIbY3wN8lmPGeUHl.jpg',
  'Aaron Taylor-Johnson': B + 'pFtHhih2XEaFaD3qOFyQW6q83br.jpg',

  // Deadpool & Wolverine
  'Ryan Reynolds': B + 'trzgptffGvAlAT6MEu01fz47cLW.jpg',
  'Hugh Jackman': B + 'oX6CpXmnXCHLyqsa4NEed1DZAKx.jpg',
  'Emma Corrin': B + 'miSbXJBlq6S3dVvOr7OoNL4axW6.jpg',
  'Matthew Macfadyen': B + '2IWtWZTpAGh8QFVBjry1IZMN7F3.jpg',
  'Dafne Keen': B + 'g325OIjIHrFr0te8ewPfhKQ2SKj.jpg',

  // Avatar: The Way of Water
  'Sam Worthington': B + 'mflBcox36s9ZPbsZPVOuhf6axaJ.jpg',
  'Zoe Saldaña': B + 'iOVbUH20il632nj2v01NCtYYeSg.jpg',
  'Sigourney Weaver': B + 'wTSnfktNBLd6kwQxgvkqYw6vEon.jpg',
  'Stephen Lang': B + 'gnO5VfkDgA2fsHweD0622LUY3Hu.jpg',
  'Kate Winslet': B + 'surklDlLW6g2D7EqycEQwHXsoD1.jpg',
}

export const castPhoto = (name: string): string | undefined => castPhotos[name]

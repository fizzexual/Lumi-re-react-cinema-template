import { useCallback } from 'react'
import { usePreferences } from '../store/usePreferences'
import { formatMoney, translate } from '../lib/i18n'

/**
 * Convenience hook bundling the active language + currency with bound
 * `t()` (translate) and `money()` (format from GBP base) helpers.
 */
export function useLocale() {
  const lang = usePreferences((s) => s.lang)
  const currency = usePreferences((s) => s.currency)

  const t = useCallback((key: string) => translate(lang, key), [lang])
  const money = useCallback(
    (baseGBP: number) => formatMoney(baseGBP, currency),
    [currency],
  )

  return { lang, currency, t, money }
}

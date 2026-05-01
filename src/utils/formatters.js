// Exchange rates relative to INR (as of May 2024)
const EXCHANGE_RATES = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
}

const LOCALE_MAP = {
  INR: 'en-IN',
  USD: 'en-US',
  EUR: 'de-DE',
}

export const convertCurrency = (value = 0, fromCurrency = 'INR', toCurrency = 'INR') => {
  if (fromCurrency === toCurrency) return Number(value) || 0
  const valueInINR = (Number(value) || 0) / EXCHANGE_RATES[fromCurrency]
  return valueInINR * EXCHANGE_RATES[toCurrency]
}

export const formatCurrency = (value = 0, currency = 'INR') => {
  const convertedValue = convertCurrency(value, 'INR', currency)
  return new Intl.NumberFormat(LOCALE_MAP[currency] || 'en-US', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(convertedValue)
}

export const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

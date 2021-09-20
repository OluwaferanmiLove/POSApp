const naira = '\u20A6';

function formatMoney(price) {
  const pieces = parseFloat(price).toFixed(2).split('')
  let ii = pieces.length - 3
  while ((ii-=3) > 0) {
    pieces.splice(ii, 0, ',')
  }
  return naira + pieces.join('')
}

export const moneyService = {
  formatMoney,
}
module.exports.money = (amount, decimalPlace = 0) => {
  // if decimalPlace > 0 and amount div 1 has remainder then use decimal else not
  const decimal = Number.isInteger(amount) ? 0 : decimalPlace
  const parts = Number(amount).toFixed(decimal).replace('.', ',').split(',')
  parts[0] = parts[0].replace(/(\d)(?=(\d{3})+\b)/g, '$1.')
  return parts.join(',')
}

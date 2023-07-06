export function calculatePercentage(
  originalValue: number,
  newValue: number,
): number {
  const difference: number = Math.abs(newValue - originalValue);
  let percentage: number;

  if (originalValue > newValue) {
    percentage = (difference / originalValue) * 100;
  } else {
    percentage = (difference / originalValue) * 100;
  }

  return percentage;
}

export function calculateValueByPercentage(
  percentage: number,
  currentValue: number,
  newValue: number,
): number {
  const difference: number = Math.abs(currentValue - newValue);
  let result: number;

  if (currentValue > newValue) {
    const percentageAsDecimal: number = percentage / 100;
    result = newValue + difference * percentageAsDecimal;
  } else {
    const percentageAsDecimal: number = percentage / 100;
    result = newValue - difference * percentageAsDecimal;
  }

  return result;
}

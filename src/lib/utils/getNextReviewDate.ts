export function getNextReviewDate(
  timesReviewed: number,
  lastReviewedAt: Date,
): Date {
  const currentDate = new Date(lastReviewedAt);

  switch (timesReviewed) {
    case 0:
      currentDate.setDate(currentDate.getDate() + 1);
      break;
    case 1:
      currentDate.setDate(currentDate.getDate() + 3);
      break;
    case 2:
      currentDate.setDate(currentDate.getDate() + 7);
      break;
    case 3:
      currentDate.setDate(currentDate.getDate() + 14);
      break;
    default:
      currentDate.setDate(currentDate.getDate() + 30);
      break;
  }

  return currentDate;
}

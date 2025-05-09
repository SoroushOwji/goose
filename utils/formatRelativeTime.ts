export function formatRelativeTime(date: string | null): string {
  if (!date || isNaN(new Date(date).getTime())) {
    return "N/A";
  }

  const givenDate = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - givenDate.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minutes ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hours ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} days ago`;
  }
}

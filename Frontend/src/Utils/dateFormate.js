export function formatTimestamp(timestamp) {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp);
  
  if (isNaN(date.getTime())) return 'N/A';

  const day = date.getDate();

  const getOrdinal = (n) => {
    if (n > 3 && n < 21) return `${n}th`;

    switch (n % 10) {
      case 1:
        return `${n}st`;
      case 2:
        return `${n}nd`;
      case 3:
        return `${n}rd`;
      default:
        return `${n}th`;
    }
  };

  const weekday = date.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: "UTC"
  });

  const month = date.toLocaleDateString("en-US", {
    month: "long",
    timeZone: "UTC"
  });

  const year = date.getUTCFullYear();

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC"
  });

  return `${getOrdinal(day)} ${weekday}, ${month} ${year} @${time}`;
}

// Example
console.log(formatTimestamp("2026-03-13T23:55:00:000Z"));
// Output: "13th Friday, March 2026 @11:55 PM"
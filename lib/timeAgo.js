export function timeAgo(postedDate) {
    const now = new Date();
    const postDate = new Date(postedDate);
  
    const secondsAgo = Math.floor((now - postDate) / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);
  
    if (secondsAgo < 60) {
      return `${secondsAgo} second${secondsAgo === 1 ? '' : 's'} ago`;
    } else if (minutesAgo < 60) {
      return `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`;
    } else if (hoursAgo < 24) {
      return `${hoursAgo} hour${hoursAgo === 1 ? '' : 's'} ago`;
    } else {
      return `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`;
    }
}  
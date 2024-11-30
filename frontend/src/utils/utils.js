export function formatMessageTime(date) {
  const messageTime =
    new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }) +
    " - " +
    new Date(date).toLocaleDateString("en-US", {
      dateStyle: "medium",
    });
  return messageTime;
}

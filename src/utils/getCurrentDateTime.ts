   export const getCurrentDateTime = () => {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    const date = now.toLocaleDateString("en-US", options)
    const time = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    return `${date} ${time}`
  }

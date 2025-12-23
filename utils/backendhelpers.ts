export const formatReadableDateTime = (
  isoString: string,
  noTime: boolean = false
) => {
  const date = new Date(isoString);

  const dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = date.toLocaleDateString("en-US", dateOptions);
  const formattedTime = date.toLocaleTimeString("en-US", timeOptions);

  return noTime ? formattedDate : `${formattedDate} at ${formattedTime}`;
};

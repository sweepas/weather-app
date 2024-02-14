function dateStampToHours(dateStamp: number) {
  const date = new Date(dateStamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  const formattedTime = `${h}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  return formattedTime;
}



export default dateStampToHours; 

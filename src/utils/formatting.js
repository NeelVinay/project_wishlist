export const fmtMoney = (n, cur) => {
  if (n === 0 || n == null) return (cur ? cur.symbol : "$") + "0";
  const d = cur ? cur.decimals : 2;
  return (cur ? cur.symbol : "$") + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: d });
};

export const formatDate = (ts) => {
  if (!ts) return "";
  const d = new Date(ts), day = d.getDate();
  const sfx = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  return day + sfx + " " + d.toLocaleString("en-US", { month: "long" }) + ", " + d.getFullYear() + "  " + d.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).toLowerCase();
};

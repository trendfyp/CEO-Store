const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function money(value: number) {
  return fmt.format(value);
}

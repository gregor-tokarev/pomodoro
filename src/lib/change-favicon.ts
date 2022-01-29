export function changeFavicon(src: string): void {
  const favicon = document.querySelector('link[rel="icon"]')

  if (favicon) {
    favicon.setAttribute('href', src)
  }
}

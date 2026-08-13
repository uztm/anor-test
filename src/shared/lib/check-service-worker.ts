export async function checkServiceWorker(cb: () => void) {
  const registrations = await navigator.serviceWorker.getRegistrations()
  registrations.forEach((reg) => {
    reg.update().then((response: unknown) => {
      const sw = response as ServiceWorkerRegistration
      if (sw.waiting) cb()
    })
  })
}

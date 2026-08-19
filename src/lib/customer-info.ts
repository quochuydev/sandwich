export type CustomerInfo = {
  customerName: string
  phone: string
  address: string
}

const STORAGE_KEY = "order.customerInfo"

export function loadCustomerInfo(): CustomerInfo | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CustomerInfo) : null
  } catch {
    return null
  }
}

export function saveCustomerInfo(info: CustomerInfo) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(info))
}

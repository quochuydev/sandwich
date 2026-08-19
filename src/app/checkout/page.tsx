import type { PaymentMethodId } from "@/config"
import { PAYMENTS } from "@/config.server"
import { CheckoutForm } from "@/components/checkout-form"

export default function CheckoutPage() {
  const methods = (Object.keys(PAYMENTS) as PaymentMethodId[])
    .filter((id) => PAYMENTS[id].enabled)
    .map((id) => ({ id, label: PAYMENTS[id].label }))

  return <CheckoutForm methods={methods} />
}

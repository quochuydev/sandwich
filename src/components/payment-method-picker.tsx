"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export type PaymentMethodOption = { id: string; label: string }

export function PaymentMethodPicker({
  methods,
  value,
  onChange,
}: {
  methods: PaymentMethodOption[]
  value: string
  onChange: (id: string) => void
}) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="gap-2">
      {methods.map((method) => (
        <Label
          key={method.id}
          htmlFor={`payment-${method.id}`}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 font-medium has-[[data-state=checked]]:border-brand has-[[data-state=checked]]:ring-1 has-[[data-state=checked]]:ring-brand"
        >
          <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
          {method.label}
        </Label>
      ))}
    </RadioGroup>
  )
}

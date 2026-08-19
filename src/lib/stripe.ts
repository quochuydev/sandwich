import Stripe from "stripe"
import { STRIPE } from "@/config"

export const stripe = STRIPE.secretKey
  ? new Stripe(STRIPE.secretKey)
  : null

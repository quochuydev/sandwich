import Stripe from "stripe"
import { STRIPE } from "@/config.server"

export const stripe = STRIPE.secretKey
  ? new Stripe(STRIPE.secretKey)
  : null

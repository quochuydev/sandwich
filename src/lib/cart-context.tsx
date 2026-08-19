"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react"

export type CartItem = {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  note: string
}

export type AppliedCoupon = {
  code: string
  label: string
  discount: number
}

type AddInput = {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  note: string
}

type PersistedState = {
  items: CartItem[]
  coupon: AppliedCoupon | null
}

type CartState = PersistedState & { hydrated: boolean }

type CartAction =
  | { type: "hydrate"; state: PersistedState }
  | { type: "add"; item: AddInput }
  | { type: "setQuantity"; id: string; quantity: number }
  | { type: "setNote"; id: string; note: string }
  | { type: "remove"; id: string }
  | { type: "setCoupon"; coupon: AppliedCoupon | null }
  | { type: "clear" }

const STORAGE_KEY = "order.cart"

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { ...action.state, hydrated: true }
    case "add": {
      const existing = state.items.find(
        (item) =>
          item.productId === action.item.productId &&
          item.note === action.item.note
      )
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === existing.id
              ? { ...item, quantity: item.quantity + action.item.quantity }
              : item
          ),
        }
      }
      const newItem: CartItem = {
        id: crypto.randomUUID(),
        ...action.item,
      }
      return { ...state, items: [...state.items, newItem] }
    }
    case "setQuantity": {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.id),
        }
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id
            ? { ...item, quantity: action.quantity }
            : item
        ),
      }
    }
    case "setNote":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, note: action.note } : item
        ),
      }
    case "remove":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
      }
    case "setCoupon":
      return { ...state, coupon: action.coupon }
    case "clear":
      return { ...state, items: [], coupon: null }
    default:
      return state
  }
}

type CartContextValue = {
  items: CartItem[]
  coupon: AppliedCoupon | null
  hydrated: boolean
  subtotal: number
  itemCount: number
  addItem: (item: AddInput) => void
  setQuantity: (id: string, quantity: number) => void
  setNote: (id: string, note: string) => void
  removeItem: (id: string) => void
  setCoupon: (coupon: AppliedCoupon | null) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    items: [],
    coupon: null,
    hydrated: false,
  })

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      const parsed = raw ? (JSON.parse(raw) as PersistedState) : null
      dispatch({
        type: "hydrate",
        state: parsed ?? { items: [], coupon: null },
      })
    } catch {
      dispatch({ type: "hydrate", state: { items: [], coupon: null } })
    }
  }, [])

  useEffect(() => {
    if (!state.hydrated) return
    const { items, coupon } = state
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, coupon }))
  }, [state.items, state.coupon, state.hydrated, state])

  const value = useMemo<CartContextValue>(() => {
    const subtotal = state.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
    return {
      items: state.items,
      coupon: state.coupon,
      hydrated: state.hydrated,
      subtotal,
      itemCount,
      addItem: (item) => dispatch({ type: "add", item }),
      setQuantity: (id, quantity) => dispatch({ type: "setQuantity", id, quantity }),
      setNote: (id, note) => dispatch({ type: "setNote", id, note }),
      removeItem: (id) => dispatch({ type: "remove", id }),
      setCoupon: (coupon) => dispatch({ type: "setCoupon", coupon }),
      clear: () => dispatch({ type: "clear" }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}

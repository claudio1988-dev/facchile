
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: number;
    name: string;
    slug: string;
    price: number;
    image: string | null;
    is_restricted: boolean;
    quantity: number;
}

interface CartStore {
    items: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    hasRestrictedItems: () => boolean;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addToCart: (product: any) => set((state) => {
                const existingItem = state.items.find((item: CartItem) => item.id === product.id);
                if (existingItem) {
                    return {
                        items: state.items.map((item: CartItem) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    };
                }
                return {
                    items: [...state.items, {
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.base_price,
                        image: product.main_image_url,
                        is_restricted: product.is_restricted,
                        quantity: 1,
                    }],
                };
            }),
            removeFromCart: (productId: number) => set((state) => ({
                items: state.items.filter((item: CartItem) => item.id !== productId),
            })),
            updateQuantity: (productId: number, quantity: number) => set((state) => {
                if (quantity <= 0) {
                    return { items: state.items.filter((item: CartItem) => item.id !== productId) };
                }
                return {
                    items: state.items.map((item: CartItem) =>
                        item.id === productId ? { ...item, quantity } : item
                    ),
                };
            }),
            clearCart: () => set({ items: [] }),
            getTotal: () => {
                return get().items.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0);
            },
            hasRestrictedItems: () => {
                return get().items.some((item: CartItem) => item.is_restricted);
            }
        }),
        {
            name: 'cart-storage',
        }
    )
);

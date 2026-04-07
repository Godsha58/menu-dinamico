import { create } from "zustand";
import type { CartLine } from "@/store/useCartStore";
import { supabase } from "@/lib/supabase";

export type RestaurantOrder = {
  id: string;
  customerName: string;
  items: CartLine[];
  total: number;
  status: "pendiente" | "entregado";
  createdAt: string;
};

type RestaurantState = {
  orders: RestaurantOrder[];
  addOrder: (
    order: Omit<RestaurantOrder, "status" | "createdAt">,
  ) => Promise<void>;
  fetchPendingOrders: () => Promise<void>;
  completeOrder: (orderId: string) => Promise<void>;
};

type OrderItemRow = {
  product_name: string;
  price: number;
  quantity: number;
  con_verdura: boolean | null;
};

type OrderRow = {
  id: string;
  ticket_id: string | null;
  customer_name: string;
  total: number;
  status: "pendiente" | "entregado";
  created_at: string;
  order_items?: OrderItemRow[] | null;
};

function mapDbOrder(row: OrderRow): RestaurantOrder {
  const items = (row.order_items ?? []).map((item, index) => ({
    lineId: `${row.ticket_id ?? row.id}-item-${index}`,
    productId: `${row.ticket_id ?? row.id}-item-${index}`,
    name: item.product_name,
    price: item.price,
    qty: item.quantity,
    withVegetables: item.con_verdura,
  }));

  return {
    id: row.ticket_id ?? row.id,
    customerName: row.customer_name,
    items,
    total: row.total,
    status: row.status,
    createdAt: row.created_at,
  };
}

export const useRestaurantStore = create<RestaurantState>()((set) => ({
  orders: [],
  addOrder: async (order) => {
    const { data: insertedOrder, error: orderError } = await supabase
      .from("orders")
      .insert({
        ticket_id: order.id,
        customer_name: order.customerName,
        total: order.total,
        status: "pendiente",
      })
      .select("id, ticket_id, customer_name, total, status, created_at")
      .single();

    if (orderError || !insertedOrder) {
      throw new Error(orderError?.message ?? "No se pudo crear la orden.");
    }

    const itemPayload = order.items.map((item) => ({
      order_id: insertedOrder.id,
      product_name: item.name,
      price: item.price,
      quantity: item.qty,
      con_verdura: item.withVegetables,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(itemPayload);

    if (itemsError) {
      throw new Error(itemsError.message);
    }

    set((s) => ({
      orders: [
        ...s.orders,
        {
          ...order,
          status: "pendiente",
          createdAt: insertedOrder.created_at,
        },
      ],
    }));
  },
  fetchPendingOrders: async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, ticket_id, customer_name, total, status, created_at, order_items(product_name, price, quantity, con_verdura)",
      )
      .eq("status", "pendiente")
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    const mapped = (data ?? []).map((row) => mapDbOrder(row as OrderRow));
    set((s) => ({
      orders: [...mapped, ...s.orders.filter((o) => o.status === "entregado")],
    }));
  },
  completeOrder: async (orderId) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "entregado" })
      .eq("ticket_id", orderId);

    if (error) {
      throw new Error(error.message);
    }

    set((s) => ({
      orders: s.orders.map((o) =>
        o.id === orderId ? { ...o, status: "entregado" } : o,
      ),
    }));
  },
}));

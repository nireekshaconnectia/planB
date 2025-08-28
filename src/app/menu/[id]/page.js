"use client";
import Item from "@/components/item/item";
import Cart from "@/components/cart";

export default function MenuItem({ params }) {
  const { id } = params;

  return (
    <>
      <Item itemId={id} />
      <Cart />
    </>
  );
}

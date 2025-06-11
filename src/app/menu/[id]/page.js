"use client";
import Item from "@/components/item/item";

export default function MenuItem({ params }) {
  const { id } = params;

  return <Item itemId={id} />;
}

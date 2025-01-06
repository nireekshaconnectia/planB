// src/app/items/[id]/page.js
import Item from "@/components/item";
import Cart from "@/components/cart";
import Items from "@/components/itemsList";
export default function Items({ params }) {
  // const { id } = params; // Get the dynamic `id` from the params

  // // Example of hardcoded data (can be replaced with API data)
  // const items = {
  //   1: { title: "First", content: "This is the first post." },
  //   2: { title: "Second Post", content: "This is the second post." },
  // };

  // const item = items[id]; // Get the post corresponding to the dynamic `id`

  // if (!item) return <p>Post not found!</p>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-50">
      <Item />
      <Items />
      <Cart />
    </main>
  );
}

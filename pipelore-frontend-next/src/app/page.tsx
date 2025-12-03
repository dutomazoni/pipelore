import { redirect } from "next/navigation";

export default function Home() {
  // Redirect from root path (/) to /repair-orders
  redirect("/repair-orders");
}

import type { Route } from "./+types/home";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "KandyPack Logistics Platform" },
    { name: "description", content: "Modern logistics and supply chain management platform" },
  ];
}

export function loader() {
  return redirect("/dashboard");
}

export default function Home() {
  // This component won't be rendered due to the redirect
  return null;
}

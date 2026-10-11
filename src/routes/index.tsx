import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/components/store/home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "VELORA — Objects, considered" }],
  }),
  component: HomePage,
});

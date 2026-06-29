import { redirect } from "next/navigation";

// Middleware handles the actual language detection and redirect.
// This is a fallback for direct access to /.
export default function RootPage() {
  redirect("/en");
}

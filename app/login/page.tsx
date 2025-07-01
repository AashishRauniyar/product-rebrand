// app/login/page.tsx
import { Suspense } from "react";
import LoginPage from "@/components/LoginPage";

export default function LoginWrapper() {
  return (
    <Suspense fallback={<div>Loading login...</div>}>
      <LoginPage />
    </Suspense>
  );
}

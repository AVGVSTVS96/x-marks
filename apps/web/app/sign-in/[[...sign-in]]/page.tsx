import { SignIn } from "@clerk/nextjs"

import { AuthShell } from "@/components/layout/auth-shell"

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Sign in"
      title="Pick up your bookmarks from anywhere."
      description="Open your saved links, folders, and notes in a workspace that keeps pace with the app instead of fighting it."
      note="Signing in returns you to the protected app route with the same Clerk session that the rest of xMarks uses."
      backHref="/"
      backLabel="Back to home"
    >
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/app"
      />
    </AuthShell>
  )
}


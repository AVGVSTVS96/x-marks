import { SignUp } from "@clerk/nextjs"

import { AuthShell } from "@/components/layout/auth-shell"

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Create account"
      title="Set up xMarks in one pass."
      description="Create your account, connect the session, and land in the app shell ready for automatic sync."
      note="The sign-up route is here so the Clerk widget can switch between entry points without dead ends."
      backHref="/sign-in"
      backLabel="Back to sign in"
    >
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/app"
      />
    </AuthShell>
  )
}


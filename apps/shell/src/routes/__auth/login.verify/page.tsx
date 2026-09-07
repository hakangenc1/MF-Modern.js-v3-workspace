import { useFetcher, useLoaderData, Link } from "@modern-js/runtime/router";
import { Helmet } from "@modern-js/runtime/head";
import { DEMO_2FA_CODE } from "@bank/mock";
import { AuthShell } from "@/components/auth-shell";
import { TwoFactorChallenge } from "@/components/two-factor-challenge";
import type { VerifyData } from "./page.data";

export default function VerifyRoute() {
  const { email } = useLoaderData() as VerifyData;

  return (
    <AuthShell
      title="Verify it’s you"
      description="Two-factor authentication keeps your account protected."
      footer={
        <>
          Lost your device?{" "}
          <Link
            to="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Use a recovery code
          </Link>
        </>
      }
    >
      <Helmet>
        <title>Verify it’s you · Northwind Bank</title>
      </Helmet>
      <TwoFactorChallenge email={email} demoCode={DEMO_2FA_CODE} />
    </AuthShell>
  );
}

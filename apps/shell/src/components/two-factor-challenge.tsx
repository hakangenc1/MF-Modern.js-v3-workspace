import { useEffect, useState } from "react";
import { useActionData, useNavigate, useNavigation, useSubmit } from "@modern-js/runtime/router";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@bank/ui/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@bank/ui/components/ui/input-otp";
import { Alert, AlertDescription } from "@bank/ui/components/ui/alert";

/**
 * 2FA one-time-code challenge. Submits `code` to the current route's action;
 * the action returns `{ next }` (Modern.js 3.5 doesn't follow action
 * redirects client-side) and we navigate.
 */
export function TwoFactorChallenge({
  email,
  demoCode = "123456",
}: {
  email: string;
  demoCode?: string;
}) {
  const submit = useSubmit();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const actionData = useActionData() as { error?: string; next?: string } | undefined;
  const [code, setCode] = useState("");
  const busy = navigation.state !== "idle";

  useEffect(() => {
    if (code.length === 6 && !busy) submit({ code }, { method: "post" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  useEffect(() => {
    if (actionData?.next) navigate(actionData.next);
  }, [actionData, navigate]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-3">
        <ShieldCheck className="size-5 text-primary" />
        <div className="text-sm">
          <p className="font-medium">Authenticator verification</p>
          <p className="text-muted-foreground">
            Enter the 6-digit code for <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
      </div>

      <form
        method="post"
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          submit({ code }, { method: "post" });
        }}
      >
        <InputOTP
          maxLength={6}
          value={code}
          onChange={setCode}
          containerClassName="justify-center"
          autoFocus
        >
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot key={i} index={i} className="size-12 text-lg" />
            ))}
          </InputOTPGroup>
        </InputOTP>

        {actionData?.error ? (
          <Alert variant="destructive">
            <AlertDescription>{actionData.error}</AlertDescription>
          </Alert>
        ) : null}

        <Button type="submit" className="w-full" disabled={busy || code.length !== 6}>
          {busy ? <Loader2 className="size-4 animate-spin" /> : null}
          Verify &amp; sign in
        </Button>
      </form>

      <p className="rounded-md bg-muted px-3 py-2 text-center text-xs text-muted-foreground">
        Demo code: <span className="font-mono font-medium text-foreground">{demoCode}</span>
      </p>
    </div>
  );
}

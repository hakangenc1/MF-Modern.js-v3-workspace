import type { LoaderFunctionArgs } from "@modern-js/runtime/router";
import type { User } from "@bank/mock";
import { getSession, loginRedirect } from "@bank/mock/session";

export type AppLayoutData = { user: User };

export const loader = async ({ request }: LoaderFunctionArgs): Promise<AppLayoutData | Response> => {
  const session = getSession(request);
  if (!session) return loginRedirect(request);
  return { user: session.user };
};

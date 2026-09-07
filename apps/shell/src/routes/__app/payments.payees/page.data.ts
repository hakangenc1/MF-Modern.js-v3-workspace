import type { LoaderFunctionArgs } from "@modern-js/runtime/router";
import { getSession } from "@bank/mock/session";
import { loadPayees } from "payments/data";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  getSession(request);
  return { payees: await loadPayees() };
};

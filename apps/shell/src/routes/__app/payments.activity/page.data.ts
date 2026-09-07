import type { LoaderFunctionArgs } from "@modern-js/runtime/router";
import { getSession } from "@bank/mock/session";
import { loadTransfers } from "payments/data";
export const loader = async ({ request }: LoaderFunctionArgs) => {
  getSession(request);
  return loadTransfers();
};

// @ts-expect-error federated module — types resolved at build time
import { loadAccountsList } from "accounts/data";
import type { LoaderFunctionArgs } from "@modern-js/runtime/router";
import { getSession } from "@bank/mock/session";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  getSession(request);
  return loadAccountsList();
};

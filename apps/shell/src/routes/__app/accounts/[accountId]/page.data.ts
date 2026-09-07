import { defer, type LoaderFunctionArgs } from "@modern-js/runtime/router";
import { getSession } from "@bank/mock/session";
// @ts-expect-error federated module (types resolved at build time)
import { loadAccountDetail, loadAccountHeader } from "accounts/data";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  getSession(request);
  const accountId = params.accountId!;
  const account = await loadAccountHeader(accountId);
  const detail = loadAccountDetail(accountId, request);
  return defer({
    account,
    category: detail.category,
    search: detail.search,
    transactions: detail.transactions,
  });
};

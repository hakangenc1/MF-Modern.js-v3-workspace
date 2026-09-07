import { defer, type LoaderFunctionArgs } from "@modern-js/runtime/router";
import { getSession } from "@bank/mock/session";
// @ts-expect-error federated module (types resolved at build time)
import { loadAccountsList, loadDashboardWidgets } from "accounts/data";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = getSession(request);
  const { accounts, netWorth } = await loadAccountsList();
  const widgets = loadDashboardWidgets();
  return defer({
    firstName: session?.user.firstName ?? "there",
    accounts,
    netWorth,
    // Streamed — flushed after the shell as each resolves.
    cashflow: widgets.cashflow,
    spending: widgets.spending,
    activity: widgets.activity,
  });
};

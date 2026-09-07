import type { AccountsListData } from "./data";
/**
 * Accounts list — a presentational component owned by the Accounts
 * micro-frontend. Router-free (plain anchors) so it renders identically whether
 * mounted standalone or federated into the shell's SSR stream.
 */
export default function AccountsView({ data }: {
    data: AccountsListData;
}): import("react/jsx-runtime").JSX.Element;

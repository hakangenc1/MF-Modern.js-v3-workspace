import { type Account, type Page, type Transaction } from "@bank/mock";
/**
 * Account detail — presentational and router-free. The shell (which owns
 * routing) drives navigation via the plain links / GET form here, and streams
 * the transaction table into `children`.
 */
export default function AccountDetailView({ account, category, search, children, }: {
    account: Account;
    category: string;
    search: string;
    children: React.ReactNode;
}): import("react/jsx-runtime").JSX.Element;
/** Resolved transaction table — rendered by the parent inside a Suspense/Await. */
export declare function TransactionsTable({ page, base, category, search, }: {
    page: Page<Transaction>;
    base: string;
    category: string;
    search: string;
}): import("react/jsx-runtime").JSX.Element;

/**
 * Federated data layer for the Accounts micro-frontend. Plain async functions
 * (no framework coupling) so the shell can call them from its route loaders over
 * Module Federation and still stream the results.
 */
import { type Account, type CashflowPoint, type NetWorth, type Page, type SpendingSlice, type Transaction } from "@bank/mock";
export interface AccountsListData {
    accounts: Account[];
    netWorth: NetWorth;
}
export declare function loadAccountsList(): Promise<AccountsListData>;
export declare function loadAccountHeader(accountId: string): Promise<Account | null>;
export interface AccountDetailParams {
    category: string;
    search: string;
    transactions: Promise<Page<Transaction>>;
}
/** Parse filters from the request and kick off (but don't await) the query. */
export declare function loadAccountDetail(accountId: string, request: Request): AccountDetailParams;
export interface DashboardWidgetData {
    cashflow: Promise<CashflowPoint[]>;
    spending: Promise<{
        slices: SpendingSlice[];
        total: number;
    }>;
    activity: Promise<Transaction[]>;
}
export declare function loadDashboardWidgets(): DashboardWidgetData;

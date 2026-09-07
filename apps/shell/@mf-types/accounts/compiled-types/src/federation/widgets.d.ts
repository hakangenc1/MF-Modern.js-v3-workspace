import { type CashflowPoint, type SpendingSlice, type Transaction } from "@bank/mock";
/**
 * Dashboard cards owned by the Accounts micro-frontend. Router-free and given
 * already-resolved data — the shell wraps each in <Suspense>/<Await> to stream.
 */
export declare function CashflowCard({ data }: {
    data: CashflowPoint[];
}): import("react/jsx-runtime").JSX.Element;
export declare function SpendingCard({ data }: {
    data: {
        slices: SpendingSlice[];
        total: number;
    };
}): import("react/jsx-runtime").JSX.Element;
export declare function RecentActivityCard({ data }: {
    data: Transaction[];
}): import("react/jsx-runtime").JSX.Element;

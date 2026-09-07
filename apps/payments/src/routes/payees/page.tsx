import { useLoaderData } from "@modern-js/runtime/router";
import PayeesView from "@/federation/PayeesView";
import type { Payee } from "@bank/mock";
export default function Page() {
  const { payees } = useLoaderData() as { payees: Payee[] };
  return <PayeesView payees={payees} />;
}

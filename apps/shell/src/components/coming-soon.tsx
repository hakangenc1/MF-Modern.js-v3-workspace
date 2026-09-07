import { Blocks } from "lucide-react";
import { PageHeader } from "@bank/ui/patterns/kit";

export function ComingSoon({
  title,
  remote,
}: {
  title: string;
  remote: string;
}) {
  return (
    <>
      <PageHeader title={title} description={`Served by the “${remote}” micro-frontend.`} />
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
        <Blocks className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          This surface is wired to the <span className="font-medium text-foreground">{remote}</span>{" "}
          remote and is coming online.
        </p>
      </div>
    </>
  );
}

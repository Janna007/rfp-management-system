import { Link, useNavigate, useParams } from "react-router-dom";
import { Mail, Sparkles, ArrowRight, Send, GitCompare  } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useProposals } from "@/services/proposal.service";

export default function ProposalList() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: proposalsData } = useProposals(id, !!id);
  const rfpProposals = proposalsData?.data;

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case "received":
        return "warning";
      case "parsed":
        return "accent";
      case "evaluated":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex w-100 justify-between items-center">
        <PageHeader
          title="Proposals"
          description="Review and manage vendor proposals"
        />
        <Button
          // disabled={checkProposalPending}
          variant="accent"
          onClick={() => navigate(`/compare/${id}`)}
        >
          <GitCompare  className="mr-2 h-4 w-4" />
          {/* {checkProposalPending ? "Pending" :"Check For Proposals"} */}
          Compare Proposals
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        {/* <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search proposals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div> */}
      </div>

      {/* Proposals */}
      {rfpProposals && rfpProposals.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No proposals yet"
          description="Proposals from vendors will appear here once they respond to your RFPs."
        />
      ) : (
        <div className="space-y-4">
          {rfpProposals &&
            rfpProposals.length > 0 &&
            rfpProposals.map((proposal) => {
              return (
                <div
                  key={proposal._id}
                  className="group rounded-xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                        <Mail className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold">
                            {proposal.vendor[0]?.name}
                          </h3>
                          <Badge variant={statusBadgeVariant(proposal.status)}>
                            {proposal.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          For: {proposal.rfp[0]?.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Received{" "}
                          {format(
                            new Date(proposal.createdAt),
                            "MMM d, yyyy 'at' h:mm a"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        ${proposal.totalPrice.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Quote
                      </p>
                    </div>
                  </div>

                  {/* AI Insights */}
                  {proposal.aiSummary && (
                    <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-accent/5 to-accent/10 border border-accent/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-accent" />
                        <span className="text-sm font-medium text-accent">
                          AI Analysis
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {proposal.aiSummary}
                      </p>
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
                    {typeof proposal.aiScore === "number" && (
                      <div>
                        <span className="text-muted-foreground">
                          AI Score:{" "}
                        </span>
                        <span
                          className={cn(
                            "font-semibold",
                            proposal.aiScore >= 90
                              ? "text-success"
                              : proposal.aiScore >= 70
                              ? "text-accent"
                              : "text-warning"
                          )}
                        >
                          {proposal.aiScore}/100
                        </span>
                      </div>
                    )}

                    <div>
                      <span className="text-muted-foreground">
                        Completeness:{" "}
                      </span>
                      <span className="font-semibold">
                        {proposal.completeness}%
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Delivery: </span>
                      <span className="font-semibold">
                       
                        {format(new Date( proposal.deliveryTime), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Warranty: </span>
                      <span className="font-semibold">{proposal.warranty}</span>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {proposal.items.slice(0, 3).map((item, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs"
                      >
                        {item.quantity}x {item.name} @ $
                        {item.unitPrice.toLocaleString()}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t flex justify-end">
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/compare/${id}`}>
                        Compare with others{" "}
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

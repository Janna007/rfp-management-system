import { useEffect, useState } from "react";
import { useSearchParams, Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Trophy,
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Clock,
  Shield,
  GitCompare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { cn } from "@/lib/utils";
import { useCompareProposals, useProposals } from "@/services/proposal.service";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function CompareProposals() {
  const { id } = useParams();

  //DATA
  const { data: proposalsData } = useProposals(id, !!id);
  const rfpProposals = proposalsData?.data;

  //MUTATIONS
  const { mutateAsync: compareProposals, isPending: isComparisonPending } =
    useCompareProposals();

  const [compareResult, setCompareResult] = useState(null);

  //HANDLERS
  const handleCompare = async () => {
    try {
      if (!id) return;
      const result = await compareProposals(id);
      setCompareResult(result.data?.data);
      toast({
        title: "Comparison Success",
        description: "Proposals compared successfully",
      });
    } catch (error) {
      toast({
        title: "Comparison failed",
        description: "Can't compare right now. Please try again later",
        variant: "destructive",
      });
    }
  };
  const lowestPrice =rfpProposals && rfpProposals.length >0 && Math.min(...rfpProposals?.map((p) => p?.totalPrice));

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/rfps">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to RFPs
          </Link>
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <PageHeader
          title="Compare Proposals"
          description="AI-powered comparison and recommendation"
        />
        <Button
          disabled={isComparisonPending}
          variant="accent"
          onClick={() => handleCompare()}
        >
          <GitCompare className="mr-2 h-4 w-4" />
          {isComparisonPending ? "Processing" : "Compare Proposals"}
        </Button>
      </div>

      {rfpProposals && rfpProposals?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No proposals to compare for this RFP.
          </p>
        </div>
      ) : (
        <>
          {/* AI Recommendation Banner */}
          {compareResult && (
            <div className="mb-8 rounded-xl border-2 border-accent bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-ai shadow-glow">
                  <Trophy className="h-6 w-6 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">AI Recommendation</h3>
                    <Badge variant="accent">Best Match</Badge>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Based on price, quality, delivery terms, and warranty
                    coverage, we recommend{" "}
                    <span className="font-semibold text-foreground">
                      {compareResult?.bestVendor}
                    </span>{" "}
                    with an AI score of{" "}
                    <span className="font-semibold text-foreground">
                      {compareResult.proposal?.aiScore}/100.{" "}
                    </span>
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1 text-success">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Best warranty terms</span>
                    </div>
                    <div className="flex items-center gap-1 text-success">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Within budget</span>
                    </div>
                    <div className="flex items-center gap-1 text-success">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Meets all requirements</span>
                    </div>
                  </div>
                  <p className="mt-2 text-muted-foreground text-sm">
                    {compareResult?.summary}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Comparison Grid */}
          <div className="overflow-x-auto">
            <div className="inline-flex gap-4 min-w-full pb-4">
              {rfpProposals &&
                rfpProposals.map((proposal) => {
                  const isLowestPrice = proposal.totalPrice === lowestPrice;
                  const budgetDiff = proposal
                    ? ((proposal.totalPrice -
                        proposal?.rfp[0]?.budget) /
                        proposal?.rfp[0]?.budget) *
                      100
                    : 0;

                  return (
                    <div
                      key={proposal._id}
                      className={cn(
                        "flex-shrink-0 w-[340px] rounded-xl border bg-card shadow-sm transition-all duration-200",
                        proposal.isBest && "border-accent ring-2 ring-accent/20"
                      )}
                    >
                      {/* Header */}
                      <div
                        className={cn(
                          "p-5 border-b",
                          proposal.isBest && "bg-accent/5"
                        )}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {proposal?.vendor[0]?.name}
                              </h3>
                              {proposal.isBest && (
                                <Badge variant="accent" className="text-xs">
                                  <Trophy className="mr-1 h-3 w-3" />
                                  Recommended
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {proposal.vendor[0]?.email}
                            </p>
                          </div>
                        </div>

                        {/* AI Score */}
                        <div className="mt-4 flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-muted-foreground">
                                AI Score
                              </span>
                              <span
                                className={cn(
                                  "text-sm font-semibold",
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
                            <div className="h-2 rounded-full bg-secondary overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all",
                                  proposal.aiScore >= 90
                                    ? "bg-success"
                                    : proposal.aiScore >= 70
                                    ? "bg-accent"
                                    : "bg-warning"
                                )}
                                style={{ width: `${proposal.aiScore}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="p-5 border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Total Price
                            </span>
                          </div>
                          {isLowestPrice && (
                            <Badge variant="success" className="text-xs">
                              Lowest
                            </Badge>
                          )}
                        </div>
                        <p className="text-2xl font-bold mt-1">
                          ${proposal.totalPrice.toLocaleString()}
                        </p>
                        <p
                          className={cn(
                            "text-sm mt-1",
                            budgetDiff <= 0 ? "text-success" : "text-warning"
                          )}
                        >
                          {budgetDiff <= 0 ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              {Math.abs(budgetDiff).toFixed(0)}% under budget
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {budgetDiff.toFixed(0)}% over budget
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Details */}
                      <div className="p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Delivery
                            </p>
                            <p className="text-sm font-medium">
                                {format(new Date( proposal.deliveryTime), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Shield className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Warranty
                            </p>
                            <p className="text-sm font-medium">
                              {proposal.warranty}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Payment Terms
                            </p>
                            <p className="text-sm font-medium">
                              {proposal.paymentTerms}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="p-5 border-t bg-secondary/30">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3">
                          Items
                        </p>
                        <div className="space-y-2">
                          {proposal.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-muted-foreground">
                                {item.name}
                              </span>
                              <span className="font-medium">
                                ${item.unitPrice.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* AI Summary */}
                      {proposal.aiSummary && (
                        <div className="p-5 border-t">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-accent" />
                            <span className="text-xs font-medium text-accent">
                              AI Summary
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {proposal.aiSummary}
                          </p>
                        </div>
                      )}

                      {/* Action */}
                      <div className="p-5 border-t">
                        <Button
                          className="w-full"
                          variant={proposal.isBest ? "accent" : "outline"}
                        >
                          {proposal.isBest
                            ? "Select This Vendor"
                            : "Select Vendor"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

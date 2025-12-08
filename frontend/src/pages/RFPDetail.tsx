import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Users,
  DollarSign,
  Clock,
  Package,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRfp, useSendRfpToVendors } from "@/services/rfp.service";
import { Vendor } from "@/types";
import { useVendors } from "@/services/vendor.service";
import { useCheckProposals, useProposals } from "@/services/proposal.service";

export default function RFPDetail() {
  const { id } = useParams();

  //DATA
  const { data: rfpData } = useRfp(id, !!id);
  const rfp = rfpData?.data;

  const { data: vendorsData, isLoading, isFetching } = useVendors({});
  const vendors = vendorsData?.data;
  
  const { data: proposalsData,  } = useProposals(id, !!id);
  const rfpProposals = proposalsData?.data;

  //MUTATION
  const { mutateAsync: sendRfpToVendors } = useSendRfpToVendors();
  const { mutateAsync: checkForProposals ,isPending:checkProposalPending} = useCheckProposals();

  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

  if (!rfp) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold">RFP Not Found</h2>
        <Button asChild className="mt-4">
          <Link to="/rfps">Back to RFPs</Link>
        </Button>
      </div>
    );
  }

  const statusBadgeVariant = (status: string) => {
    switch (status) {
      case "draft":
        return "draft";
      case "sent":
        return "sent";
      case "receiving_responses":
        return "receiving";
      case "completed":
        return "completed";
      default:
        return "default";
    }
  };

  const handleVendorToggle = (vendorId: string) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSendRFP = async () => {
    if (selectedVendors.length === 0) {
      toast({
        title: "No Vendors Selected",
        description: "Please select at least one vendor to send the RFP.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await sendRfpToVendors({
        vendorIds: selectedVendors,
        rfpId: rfp?._id,
      });

      const vendorNames = selectedVendors
        .map((id) => vendors.find((v) => v._id === id)?.name)
        .filter(Boolean)
        .join(", ");

      toast({
        title: "RFP Sent Successfully",
        description: `RFP has been sent to: ${vendorNames}`,
      });

      setSelectedVendors([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCheckForProposals = async (rfpId: string) => {
    try {
      const response = await checkForProposals(rfpId);

      toast({
        title: "Proposals Checked",
        description: response?.data?.message,
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Something went wrong!",
        description: "Please select at least one vendor to send the RFP.",
        variant: "destructive",
      });
    }
  }

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

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{rfp.title}</h1>
            <Badge variant={statusBadgeVariant(rfp.status)} className="text-sm">
              {rfp.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="mt-2 text-muted-foreground max-w-2xl">
            {rfp.description}
          </p>
        </div>
        {rfp.status === "draft" && (
          <Button variant="accent" onClick={handleSendRFP}>
            <Send className="mr-2 h-4 w-4" />
            Send to Vendors
          </Button>
        )}
        {rfp.status !== "draft" && (
          <Button 
            disabled={checkProposalPending}
            variant="accent" onClick={() => handleCheckForProposals(rfp?._id)}>
            <Send className="mr-2 h-4 w-4" />
            {checkProposalPending ? "Pending" :"Check For Proposals"}
          </Button>
        )}
        {rfp.status !== "draft" && rfpProposals && rfpProposals?.length > 0 && (
          <Button asChild variant="accent">
            <Link to={`/proposals/${rfp._id}`}>View Proposals</Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">RFP Details</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-semibold">
                    ${rfp.budget.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Delivery Deadline
                  </p>
                  <p className="font-semibold">
                    {format(new Date(rfp.deliveryDeadline), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Terms</p>
                  <p className="font-semibold">
                    {rfp.paymentTerms || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <Package className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Warranty</p>
                  <p className="font-semibold">
                    {rfp.warrantyRequirement || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Requested Items</h2>
            <div className="space-y-3">
              {rfp.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg border bg-background"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.specifications && (
                      <p className="text-sm text-muted-foreground">
                        {item.specifications}
                      </p>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    Qty: {item.quantity}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Proposals Received */}
          {rfpProposals && rfpProposals?.length > 0 && (
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Proposals Received</h2>
                <Badge variant="accent">{rfpProposals.length} proposals</Badge>
              </div>
              <div className="space-y-3">
                {rfpProposals.map((proposal) => {
                 
                  return (
                    <div
                      key={proposal._id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-background"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                          <Mail className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium">{proposal.vendor[0]?.name || "unknown"}</p>
                          <p className="text-sm text-muted-foreground">
                            $
                            {proposal?.totalPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">
                            Completeness
                          </p>
                          <p
                            className={cn(
                              "font-semibold",
                              proposal.completeness >= 90
                                ? "text-success"
                                : proposal.completeness >= 70
                                ? "text-accent"
                                : "text-warning"
                            )}
                          >
                            {proposal.completeness}/100
                          </p>
                        </div>
                        <Badge
                          variant={
                            proposal.status === "evaluated"
                              ? "success"
                              : "warning"
                          }
                        >
                          {proposal.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Vendor Selection */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-card p-6 shadow-sm sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-accent" />
              <h3 className="font-semibold">Select Vendors</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Choose which vendors should receive this RFP.
            </p>

            <div className="space-y-3">
              {vendors?.map((vendor: Vendor) => (
                <label
                  key={vendor?._id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    rfp?.selectedVendors.includes(vendor?._id)
                      ? "border-accent bg-accent/5"
                      : "hover:border-muted-foreground/30"
                  )}
                >
                  <Checkbox
                    disabled={rfp?.selectedVendors.includes(vendor._id)}
                    checked={selectedVendors.includes(vendor._id)}
                    onCheckedChange={() => handleVendorToggle(vendor._id)}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{vendor.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {vendor.email}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {rfp.status === "draft" && (
              <Button
                onClick={handleSendRFP}
                className="w-full mt-4"
                variant="accent"
                disabled={selectedVendors.length === 0}
              >
                <Send className="mr-2 h-4 w-4" />
                Send to {selectedVendors.length} Vendor
                {selectedVendors.length !== 1 ? "s" : ""}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

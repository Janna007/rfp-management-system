import { Link } from "react-router-dom";
import { Plus, Search, Filter, Clock, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { QueryObj } from "@/types";
import { useRfps } from "@/services/rfp.service";

export default function RFPList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  //QUERYOBJ
  const queryObj = useMemo(() => {
    const obj: QueryObj = { page: page?.toString(), limit: limit?.toString() };

    if (searchQuery) {
      obj.search = searchQuery;
    }

    return obj;
  }, [page, limit, searchQuery]);

  //DATA
  const { data: rfpData, isLoading, isFetching } = useRfps(queryObj);
  const rfps = rfpData?.data;

  //LOADING
  const loading = isLoading || isFetching;

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

  const statusLabel = (status: string) => {
    switch (status) {
      case "draft":
        return "Draft";
      case "sent":
        return "Sent";
      case "receiving_responses":
        return "Receiving";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="RFPs"
        description="Manage your Requests for Proposals"
        actions={
          <Button asChild variant="accent">
            <Link to="/rfps/create">
              <Plus className="mr-2 h-4 w-4" />
              Create RFP
            </Link>
          </Button>
        }
      />

      {/* Search and Filters */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search RFPs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>



      {/* RFP List */}
      {!rfpData || rfpData?.total === 0 ? (
        <EmptyState
          icon={Search}
          title="No RFPs found"
          description="Create your first RFP to get started with the procurement process."
          action={{ label: "Create RFP", to: "/rfps/create", func: () => null }}
        />
      ) : (
        <div className="space-y-4">
          {rfps?.map((rfp) => (
            <Link
              key={rfp._id}
              to={`/rfps/${rfp._id}`}
              className="group block rounded-xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-accent/50"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold group-hover:text-accent transition-colors">
                      {rfp.title}
                    </h3>
                    <Badge variant={statusBadgeVariant(rfp.status)}>
                      {statusLabel(rfp.status)}
                    </Badge>
                  </div>
                  <p className="mt-2 text-muted-foreground line-clamp-2">
                    {rfp.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>
                    Budget:{" "}
                    <span className="font-medium text-foreground">
                      ${rfp.budget.toLocaleString()}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    Due:{" "}
                    <span className="font-medium text-foreground">
                      {format(new Date(rfp.deliveryDeadline), "MMM d, yyyy")}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>
                    <span className="font-medium text-foreground">
                      {rfp.selectedVendors.length}
                    </span>{" "}
                    vendors selected
                  </span>
                </div>
              </div>

              {rfp.items.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {rfp.items.slice(0, 3).map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium"
                    >
                      {item.quantity}x {item.name}
                    </span>
                  ))}
                  {rfp.items.length > 3 && (
                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
                      +{rfp.items.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

import { ChangeEvent, useCallback, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Mail,
  Phone,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { QueryObj, Vendor } from "@/types";
import { toast } from "@/hooks/use-toast";
import {
  useCreateVendor,
  useDeleteVendor,
  useUpdateVendor,
  useVendors,
} from "@/services/vendor.service";
import { useDebounceCallback } from "@/hooks/useDebounceCallback";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

export default function VendorList() {
  //STATES
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  //QUERYOBJ
  const queryObj = useMemo(() => {
    const obj: QueryObj = { page: page?.toString(), limit: limit?.toString() };

    if (searchQuery) {
      obj.search = searchQuery;
    }

    return obj;
  }, [page, limit, searchQuery]);

  //DATA
  const { data: vendorsData, isLoading, isFetching } = useVendors(queryObj);
  const vendors = vendorsData?.data;

  //LOADING...
  const loading = isLoading || isFetching;

  //MUTATION
  const { mutateAsync: createVendor } = useCreateVendor();
  const { mutateAsync: updateVendor } = useUpdateVendor();
  const { mutateAsync: deleteVendor } = useDeleteVendor();

  const handleSubmit = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingVendor) {
        // UPDATE API CALL
        await updateVendor({
          _id: editingVendor._id,
          ...formData,
        });

        toast({
          title: "Vendor Updated",
          description: `${formData.name} has been updated.`,
        });
      } else {
        // CREATE API CALL
        await createVendor(formData);

        toast({
          title: "Vendor Added",
          description: `${formData.name} has been added.`,
        });
      }

      // reset form after successful create/update
      setIsDialogOpen(false);
      setEditingVendor(null);
      setFormData({ name: "", email: "", phone: "", notes: "" });
    } catch (err) {
      console.log(err, "ERROR IN CREATE VENDOR");
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone || "",
      notes: vendor.notes || "",
    });
    setIsDialogOpen(true);
  };

  const confirmDelete = (vendor: Vendor) => {
    setVendorToDelete(vendor);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!vendorToDelete) return;

    try {
      await deleteVendor(vendorToDelete._id);

      toast({
        title: "Vendor Deleted",
        description: `${vendorToDelete.name} has been removed.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not delete vendor. Try again.",
        variant: "destructive",
      });
    }

    setDeleteDialogOpen(false);
    setVendorToDelete(null);
  };

  const openNewVendorDialog = () => {
    setEditingVendor(null);
    setFormData({ name: "", email: "", phone: "", notes: "" });
    setIsDialogOpen(true);
  };

  //SEARCH HANDLER
  const debouncedHandleSearch = useDebounceCallback((text: string) => {
    try {
      setSearchQuery(text);
    } catch (error) {
      console.log(error, "error in the debounce function");
    }
  }, 1000);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Vendors"
        description="Manage your vendor network"
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="accent" onClick={openNewVendorDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingVendor ? "Edit Vendor" : "Add New Vendor"}
                </DialogTitle>
                <DialogDescription>
                  {editingVendor
                    ? "Update the vendor's information below."
                    : "Add a new vendor to your network."}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Acme Corporation"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="contact@acme.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+1 555-0100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Any additional notes about this vendor..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmit}>
                  {editingVendor ? "Update" : "Add"} Vendor
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            // value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              debouncedHandleSearch(e.target.value)
            }
            className="pl-10"
          />
        </div>
      </div>

      {/* Vendor Grid */}
      {loading ? (
        // Loading State
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="w-full">
                  <Skeleton className="h-5 w-3/4 mb-3" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </div>
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
              <Skeleton className="h-4 w-full mt-4" />
            </div>
          ))}
        </div>
      ) : !vendorsData ||
        (vendorsData?.total === 0 && vendorsData?.data?.length === 0) ? (
        <EmptyState
          icon={Search}
          title="No vendors found"
          description="Add vendors to your network to start sending RFPs."
          action={{ label: "Add Vendor", to: "#", func: openNewVendorDialog }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vendors?.map((vendor: Vendor) => (
            <div
              key={vendor._id}
              className="group rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{vendor.name}</h3>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${vendor.email}`}
                        className="hover:text-accent transition-colors"
                      >
                        {vendor.email}
                      </a>
                    </div>
                    {vendor.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{vendor.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(vendor)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => confirmDelete(vendor)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {vendor.notes && (
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2 border-t pt-3">
                  {vendor.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Delete Vendor?"
        description={`Are you sure you want to delete ${vendorToDelete?.name}?`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </div>
  );
}

import { getServerUserDetails, getServerUserImage } from "@/lib/server/data";
import BusinessProfileForm from "@/components/Settings/BusinessProfileForm";
import { Building2 } from "lucide-react";

const Page = async () => {
  const [userDetails, userImage] = await Promise.all([
    getServerUserDetails("userDetail"),
    getServerUserImage(),
  ]);
  const userDetail = userDetails[0] ?? null;

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            {userDetail
              ? "Update your business profile — changes reflect on all new invoices."
              : "Set up your business profile to start creating invoices."}
          </p>
        </div>
      </div>

      <BusinessProfileForm initial={userDetail} initialLogo={userImage?.bussinessLogo ?? null} />
    </div>
  );
};

export default Page;

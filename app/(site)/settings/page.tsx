import { getServerUserDetails, getServerUserImage } from "@/lib/server/data";
import BusinessProfileForm from "@/components/Settings/BusinessProfileForm";

const Page = async () => {
  const [userDetails, userImage] = await Promise.all([
    getServerUserDetails("userDetail"),
    getServerUserImage(),
  ]);
  const userDetail = userDetails[0] ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {userDetail
            ? "Update your business profile — changes reflect on all new invoices."
            : "Set up your business profile to start creating invoices."}
        </p>
      </div>

      <BusinessProfileForm initial={userDetail} initialLogo={userImage?.bussinessLogo ?? null} />
    </div>
  );
};

export default Page;

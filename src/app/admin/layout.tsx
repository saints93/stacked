import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if we're in development mode
  // In production, this layout will show a 404
  const isDevelopment = process.env.NODE_ENV === "development";

  if (!isDevelopment) {
    notFound();
  }

  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}

export const metadata = {
  title: "Admin - Project Manager",
  description: "Manage your portfolio projects",
  robots: {
    index: false,
    follow: false,
  },
};

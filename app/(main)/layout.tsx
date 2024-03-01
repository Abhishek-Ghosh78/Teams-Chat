import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full">
      <div className="hidden md:flex">
        <NavigationSidebar />
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default MainLayout;

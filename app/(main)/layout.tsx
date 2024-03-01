import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full flex">
      <div className="hidden md:flex">
        <NavigationSidebar />
      </div>
      <main className="flex-1 h-full">{children}</main>
    </div>
  );
};

export default MainLayout;

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { NavigationMobile } from "./navigation/navigation-mobile";

export const MobileToggle = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div>
          <NavigationMobile />
        </div>
      </SheetContent>
    </Sheet>
  );
};

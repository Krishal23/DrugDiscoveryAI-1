import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-ibm font-semibold text-primary">{title}</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="flex items-center">
              <i className="ri-upload-2-line mr-2"></i>
              Import Data
            </Button>
            <Button size="sm" className="bg-accent text-white hover:bg-blue-600 flex items-center">
              <i className="ri-add-line mr-2"></i>
              New Project
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

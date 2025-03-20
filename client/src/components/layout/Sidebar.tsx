import { Link, useLocation } from "wouter";

interface NavItem {
  path: string;
  name: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: "/", name: "Dashboard", icon: "ri-dashboard-line" },
  { path: "/targets", name: "Target Identification", icon: "ri-target-line" },
  { path: "/drug-generator", name: "Drug Generation", icon: "ri-flask-line" },
  { path: "/interaction-predictor", name: "Interaction Prediction", icon: "ri-pulse-line" },
  { path: "/admet-analyzer", name: "ADMET Prediction", icon: "ri-test-tube-line" },
  { path: "/virtual-screening", name: "Virtual Screening", icon: "ri-microscope-line" },
  { path: "/clinical-trials", name: "Clinical Trials", icon: "ri-line-chart-line" }
];

const Sidebar = () => {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-primary text-white flex flex-col">
      {/* Logo Area */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <h1 className="text-lg font-ibm font-semibold">DrugDiscovery AI</h1>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link href={item.path}>
                <div className={`flex items-center px-4 py-3 hover:bg-primary-700 ${location === item.path ? 'bg-primary-800' : ''} text-white cursor-pointer`}>
                  <i className={`${item.icon} mr-3`}></i>
                  <span>{item.name}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User Profile */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white">
            <span>JD</span>
          </div>
          <div>
            <p className="text-sm font-medium">Dr. Jane Doe</p>
            <p className="text-xs text-gray-400">Research Scientist</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

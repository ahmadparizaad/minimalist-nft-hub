import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  AlertCircle, 
  ArrowUpRight, 
  CheckCircle, 
  Clock, 
  Mail, 
  Server, 
  Wallet, 
  Webhook,
  X 
} from "lucide-react";

// Status types
enum SystemStatus {
  Operational = "operational",
  Degraded = "degraded",
  Outage = "outage",
  Maintenance = "maintenance"
}

// Mock system components
const systemComponents = [
  { 
    id: 1, 
    name: "NFT Marketplace", 
    status: SystemStatus.Operational, 
    uptime: "99.98%",
    description: "Buy, sell, and trade NFTs" 
  },
  { 
    id: 2, 
    name: "Wallet Connectivity", 
    status: SystemStatus.Operational, 
    uptime: "99.95%",
    description: "Connection to Web3 wallets" 
  },
  { 
    id: 3, 
    name: "Minting Services", 
    status: SystemStatus.Operational, 
    uptime: "99.90%",
    description: "Creation of new NFTs" 
  },
  { 
    id: 4, 
    name: "Transaction Processing", 
    status: SystemStatus.Operational, 
    uptime: "99.99%",
    description: "Processing blockchain transactions" 
  },
  { 
    id: 5, 
    name: "API Services", 
    status: SystemStatus.Operational, 
    uptime: "99.97%",
    description: "Third-party API integrations" 
  },
  { 
    id: 6, 
    name: "Metadata Services", 
    status: SystemStatus.Operational, 
    uptime: "99.93%",
    description: "NFT metadata and image storage" 
  }
];

// Mock incident history
const incidentHistory = [
  {
    id: 1,
    date: "2023-06-15",
    title: "API Performance Degradation",
    status: "Resolved",
    duration: "45 minutes",
    description: "Our API services experienced degraded performance due to a database issue. The problem was identified and resolved.",
    updates: [
      { time: "10:15 AM EST", message: "Investigating reports of slow API responses." },
      { time: "10:35 AM EST", message: "Identified database connection pool issue as the root cause." },
      { time: "11:00 AM EST", message: "Issue resolved, monitoring for any recurrence." }
    ]
  },
  {
    id: 2,
    date: "2023-05-20",
    title: "Wallet Connection Issues",
    status: "Resolved",
    duration: "1 hour 20 minutes",
    description: "Users experienced difficulties connecting their wallets due to changes in the MetaMask API. A fix was deployed.",
    updates: [
      { time: "3:45 PM EST", message: "Investigating wallet connection failures." },
      { time: "4:15 PM EST", message: "Identified incompatibility with recent MetaMask update." },
      { time: "4:50 PM EST", message: "Deployed hotfix to address compatibility issues." },
      { time: "5:05 PM EST", message: "Issue resolved, all wallet connections restored." }
    ]
  },
  {
    id: 3,
    date: "2023-04-10",
    title: "Scheduled Maintenance",
    status: "Completed",
    duration: "2 hours",
    description: "Scheduled maintenance to upgrade our database infrastructure for improved performance.",
    updates: [
      { time: "2:00 AM EST", message: "Beginning scheduled maintenance window." },
      { time: "3:30 AM EST", message: "Database upgrades completed." },
      { time: "4:00 AM EST", message: "Maintenance completed ahead of schedule, all systems operational." }
    ]
  }
];

export default function PlatformStatus() {
  const [email, setEmail] = useState("");
  const [selectedIncident, setSelectedIncident] = useState<number | null>(null);
  const [platformStatus, setPlatformStatus] = useState<SystemStatus>(SystemStatus.Operational);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    // Calculate overall platform status based on components
    const hasOutage = systemComponents.some(c => c.status === SystemStatus.Outage);
    const hasDegraded = systemComponents.some(c => c.status === SystemStatus.Degraded);
    const hasMaintenance = systemComponents.some(c => c.status === SystemStatus.Maintenance);
    
    if (hasOutage) {
      setPlatformStatus(SystemStatus.Outage);
    } else if (hasDegraded) {
      setPlatformStatus(SystemStatus.Degraded);
    } else if (hasMaintenance) {
      setPlatformStatus(SystemStatus.Maintenance);
    } else {
      setPlatformStatus(SystemStatus.Operational);
    }

    // Set last updated time
    const now = new Date();
    setLastUpdated(now.toLocaleString());
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`You've subscribed to status updates with ${email}`);
    setEmail("");
  };

  const getStatusColor = (status: SystemStatus) => {
    switch (status) {
      case SystemStatus.Operational:
        return "text-green-500 bg-green-50";
      case SystemStatus.Degraded:
        return "text-yellow-500 bg-yellow-50";
      case SystemStatus.Outage:
        return "text-red-500 bg-red-50";
      case SystemStatus.Maintenance:
        return "text-blue-500 bg-blue-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const getStatusIcon = (status: SystemStatus) => {
    switch (status) {
      case SystemStatus.Operational:
        return <CheckCircle className="h-5 w-5" />;
      case SystemStatus.Degraded:
        return <AlertCircle className="h-5 w-5" />;
      case SystemStatus.Outage:
        return <X className="h-5 w-5" />;
      case SystemStatus.Maintenance:
        return <Clock className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Platform Status Header */}
        <div className={`${getStatusColor(platformStatus)} py-12`}>
          <div className="container mx-auto max-w-4xl px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              {getStatusIcon(platformStatus)}
              <h1 className="text-2xl font-display font-bold">Platform Status</h1>
            </div>
            <div className="mb-6">
              <div className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-medium ${getStatusColor(platformStatus)}`}>
                {platformStatus === SystemStatus.Operational && "All Systems Operational"}
                {platformStatus === SystemStatus.Degraded && "Some Systems Experiencing Issues"}
                {platformStatus === SystemStatus.Outage && "System Outage Detected"}
                {platformStatus === SystemStatus.Maintenance && "Scheduled Maintenance in Progress"}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        <div className="container mx-auto max-w-4xl px-4 py-12">
          {/* Current Status */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6">System Components</h2>
            <div className="rounded-lg overflow-hidden border border-border">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-sm">Component</th>
                    <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-sm hidden md:table-cell">Uptime</th>
                    <th className="text-left py-3 px-4 font-medium text-sm hidden md:table-cell">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {systemComponents.map((component) => (
                    <tr key={component.id} className="bg-white">
                      <td className="py-3 px-4">
                        <div className="font-medium">{component.name}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(component.status)}`}>
                          {getStatusIcon(component.status)}
                          <span className="capitalize">
                            {component.status === SystemStatus.Operational && "Operational"}
                            {component.status === SystemStatus.Degraded && "Degraded"}
                            {component.status === SystemStatus.Outage && "Outage"}
                            {component.status === SystemStatus.Maintenance && "Maintenance"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div className="text-sm">{component.uptime}</div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <div className="text-sm text-muted-foreground">{component.description}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Incident History */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-6">Incident History</h2>
            <div className="space-y-4">
              {incidentHistory.map((incident) => (
                <div key={incident.id} className="rounded-lg border border-border overflow-hidden">
                  <div 
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between bg-white cursor-pointer hover:bg-muted/10 transition-colors"
                    onClick={() => setSelectedIncident(selectedIncident === incident.id ? null : incident.id)}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <div className={`rounded-full w-2 h-2 ${incident.status === 'Resolved' || incident.status === 'Completed' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <span className="font-medium">{incident.title}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {new Date(incident.date).toLocaleDateString()} · {incident.status} · {incident.duration}
                      </div>
                    </div>
                    <div className="mt-2 md:mt-0">
                      <Button variant="ghost" size="sm">
                        {selectedIncident === incident.id ? "Hide details" : "View details"}
                      </Button>
                    </div>
                  </div>
                  
                  {selectedIncident === incident.id && (
                    <div className="px-4 py-3 bg-muted/10 border-t border-border">
                      <p className="text-sm mb-4">{incident.description}</p>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Updates:</h4>
                        <div className="space-y-2">
                          {incident.updates.map((update, index) => (
                            <div key={index} className="text-sm flex gap-3">
                              <div className="font-mono">{update.time}</div>
                              <div>{update.message}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Subscription */}
          <div className="rounded-lg border border-border bg-white p-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-1">Subscribe to Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Get notified when there are updates to our platform status.
                </p>
              </div>
              <form onSubmit={handleSubscribe} className="w-full md:w-auto flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit">Subscribe</Button>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="container mx-auto max-w-4xl px-4 py-8">
          <h2 className="text-xl font-semibold mb-6">Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <a 
              href="/help-center" 
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-white hover:shadow-sm transition-all"
            >
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Webhook className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">API Status</div>
                <div className="text-sm text-muted-foreground">Check our API documentation</div>
              </div>
              <ArrowUpRight className="h-4 w-4 ml-auto" />
            </a>
            
            <a 
              href="/help-center" 
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-white hover:shadow-sm transition-all"
            >
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">Service Status</div>
                <div className="text-sm text-muted-foreground">View individual service status</div>
              </div>
              <ArrowUpRight className="h-4 w-4 ml-auto" />
            </a>
            
            <a 
              href="/help-center" 
              className="flex items-center gap-3 p-4 rounded-lg border border-border bg-white hover:shadow-sm transition-all"
            >
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <div className="font-medium">Blockchain Status</div>
                <div className="text-sm text-muted-foreground">Check network conditions</div>
              </div>
              <ArrowUpRight className="h-4 w-4 ml-auto" />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Camera, Flashlight, Settings, CheckCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function QRScanner() {
  const [manualBookId, setManualBookId] = useState("");
  const [isFlashOn, setIsFlashOn] = useState(false);
  const { toast } = useToast();

  const handleManualSubmit = () => {
    if (manualBookId.trim()) {
      toast({
        title: "Book ID submitted",
        description: `Processing book ID: ${manualBookId}`,
      });
      setManualBookId("");
    }
  };

  const recentScans = [
    {
      id: "1",
      title: "Financial Management",
      action: "Successfully borrowed",
      time: "2 min ago",
      status: "success",
    },
    {
      id: "2",
      title: "Marketing Research",
      action: "Book details viewed",
      time: "5 min ago",
      status: "info",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-gray-300 hover:text-white"
                onClick={() => window.history.back()}
              >
                <span>←</span>
                <span>Back</span>
              </Button>
              <h1 className="text-xl font-semibold text-white">QR Code Scanner</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Scanner Interface */}
        <Card className="bg-gray-800 rounded-2xl p-8 text-center mb-6">
          <div className="mb-6">
            <QrCode className="text-6xl text-white mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-white mb-2">Scan Book QR Code</h2>
            <p className="text-gray-300">Position the QR code within the frame to scan</p>
          </div>

          {/* Camera Preview Mockup */}
          <div 
            className="relative bg-black rounded-lg mb-6 mx-auto overflow-hidden"
            style={{ width: '320px', height: '240px' }}
          >
            <div 
              className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center"
            >
              <div className="text-center">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 text-sm">Camera view would appear here</p>
              </div>
            </div>
            
            {/* Scanning overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-2 tu-border-blue rounded-lg relative" style={{ width: '200px', height: '200px' }}>
                {/* Corner indicators */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-l-4 border-t-4 tu-border-blue"></div>
                <div className="absolute -top-1 -right-1 w-6 h-6 border-r-4 border-t-4 tu-border-blue"></div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-4 border-b-4 tu-border-blue"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-4 border-b-4 tu-border-blue"></div>
                
                {/* Scanning line animation */}
                <div className="absolute top-0 left-0 w-full h-1 tu-bg-blue opacity-70 animate-pulse"></div>
              </div>
            </div>
            
            {/* Status indicator */}
            <div className="absolute top-4 left-4 tu-bg-green text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
              <Camera className="w-3 h-3" />
              <span>Camera Active</span>
            </div>
          </div>

          {/* Scanner Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            <Button className="bg-white text-gray-900 hover:bg-gray-100">
              <Camera className="w-4 h-4 mr-2" />
              Switch Camera
            </Button>
            <Button 
              className={`tu-bg-blue text-white hover:bg-blue-700 ${isFlashOn ? 'tu-bg-amber' : ''}`}
              onClick={() => setIsFlashOn(!isFlashOn)}
            >
              <Flashlight className="w-4 h-4 mr-2" />
              {isFlashOn ? 'Flash On' : 'Flash Off'}
            </Button>
          </div>

          {/* Manual Entry Option */}
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-300 mb-4">Can't scan? Enter book ID manually:</p>
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Enter Book ID..."
                value={manualBookId}
                onChange={(e) => setManualBookId(e.target.value)}
                className="flex-1 bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button 
                onClick={handleManualSubmit}
                className="tu-bg-blue text-white hover:bg-blue-700"
              >
                Submit
              </Button>
            </div>
          </div>
        </Card>

        {/* Recent Scans */}
        <Card className="bg-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Scans</h3>
          <div className="space-y-3">
            {recentScans.map((scan) => (
              <div key={scan.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    scan.status === 'success' ? 'tu-bg-green' : 'tu-bg-blue'
                  }`}>
                    {scan.status === 'success' ? (
                      <CheckCircle className="text-white w-3 h-3" />
                    ) : (
                      <Info className="text-white w-3 h-3" />
                    )}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{scan.title}</p>
                    <p className="text-gray-300 text-xs">{scan.action}</p>
                  </div>
                </div>
                <span className="text-gray-400 text-xs">{scan.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

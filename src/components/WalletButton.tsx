import { Button } from "@/components/ui/button";
import { useWeb3 } from "@/context/Web3Context";
import { formatAddress } from "@/utils/web3";
import { Wallet, ChevronDown, LogOut, CircleDollarSign } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";

export function WalletButton() {
  const { web3State, connectWallet, disconnectWallet, requestSFuel } = useWeb3();
  const { isConnected, account, sFuelBalance, usdcBalance, isLoading, hasRequestedSFuel } = web3State;
  const navigate = useNavigate();

  if (isConnected && account) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border border-border/60 bg-background/80 backdrop-blur-sm"
          >
            <span className="text-sm font-medium">{formatAddress(account)}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 glass">
          <DropdownMenuItem 
            onClick={() => navigate(`/profile/${account}`)}
            className="cursor-pointer"
          >
            My Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex justify-between">
            <span>Balance:</span>
            <span className="font-medium">{usdcBalance.toFixed(2)} USDC</span>
          </DropdownMenuItem>
          {/* <DropdownMenuItem className="flex justify-between">
            <span>sFuel:</span>
            <span className="font-medium">{sFuelBalance.toFixed(4)}</span>
          </DropdownMenuItem> */}
          <DropdownMenuSeparator />
          {/* <DropdownMenuItem 
            disabled={hasRequestedSFuel || isLoading}
            onClick={() => requestSFuel()}
            className="cursor-pointer"
          >
            <CircleDollarSign className="mr-2 h-4 w-4" />
            <span>{isLoading ? 'Requesting...' : 'Request sFuel'}</span>
          </DropdownMenuItem> */}
          <DropdownMenuItem 
            onClick={() => disconnectWallet()}
            className="cursor-pointer text-red-500 focus:text-red-500"
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button 
      onClick={() => connectWallet()} 
      disabled={isLoading}
      className="bg-primary hover:bg-primary/90 text-white"
    >
      {isLoading ? (
        <span className="flex items-center">
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
          Connecting...
        </span>
      ) : (
        <span className="flex items-center">
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallet
        </span>
      )}
    </Button>
  );
}

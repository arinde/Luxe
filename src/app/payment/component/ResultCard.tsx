import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { PaymentStatus } from "@/store/slices/paymentSlice";
import { formatCurrency } from "@/lib/utils";

interface ResultCardProps {
  status: PaymentStatus;
  responseCode: string | null;
  error: string | null;
  amount: number | null;
  onRetry: () => void;
  onHome: () => void;
}

interface StateConfig {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  showAmount: boolean;
  primaryLabel: string;
  primaryAction: "retry" | "home";
  showSecondary: boolean;
}

function getConfig(
  status: PaymentStatus,
  error: string | null,
  responseCode: string | null
): StateConfig {
  switch (status) {
    case "verifying":
    case "processing":
      return {
        icon: <Loader2 size={48} className="text-[#E8C547] animate-spin" />,
        title: "Verifying Payment",
        subtitle: "Please wait while we confirm your transaction...",
        showAmount: false,
        primaryLabel: "",
        primaryAction: "home",
        showSecondary: false,
      };

    case "success":
      return {
        icon: <CheckCircle size={48} className="text-[#4CAF82]" />,
        title: "Payment Successful",
        subtitle: "Your order has been confirmed and is being processed.",
        showAmount: true,
        primaryLabel: "Back to Home",
        primaryAction: "home",
        showSecondary: false,
      };

    case "cancelled":
      return {
        icon: <AlertCircle size={48} className="text-[#888888]" />,
        title: "Payment Cancelled",
        subtitle: "You cancelled the payment. Your cart is still saved.",
        showAmount: false,
        primaryLabel: "Try Again",
        primaryAction: "retry",
        showSecondary: true,
      };

    case "failed":
      return {
        icon: <XCircle size={48} className="text-[#E05A5A]" />,
        title: "Payment Failed",
        subtitle: error ?? "Something went wrong. Please try again.",
        showAmount: false,
        primaryLabel: "Try Again",
        primaryAction: "retry",
        showSecondary: true,
      };

    default:
      return {
        icon: <Loader2 size={48} className="text-[#E8C547] animate-spin" />,
        title: "Loading...",
        subtitle: "",
        showAmount: false,
        primaryLabel: "",
        primaryAction: "home",
        showSecondary: false,
      };
  }
}

export default function ResultCard({
  status,
  responseCode,
  error,
  amount,
  onRetry,
  onHome,
}: ResultCardProps) {
  const config = getConfig(status, error, responseCode);
  const isLoading = status === "verifying" || status === "processing";

  return (
    <div className="bg-[#161616] border border-[#2A2A2A] rounded-2xl p-10 w-full max-w-md flex flex-col items-center gap-6 text-center">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-[#1E1E1E] flex items-center justify-center">
        {config.icon}
      </div>

      {/* Text */}
      <div className="flex flex-col gap-2">
        <h2 className="text-[#F5F5F3] font-['Syne'] text-2xl font-semibold">
          {config.title}
        </h2>
        <p className="text-[#888888] font-['Inter'] text-sm leading-relaxed">
          {config.subtitle}
        </p>
      </div>

      {/* Amount */}
      {config.showAmount && amount && (
        <div className="bg-[#1E1E1E] border border-[#2A2A2A] rounded-xl px-6 py-4 w-full">
          <p className="text-[#888888] font-['Inter'] text-xs uppercase tracking-widest mb-1">
            Amount Paid
          </p>
          <p className="text-[#F5F5F3] font-['Syne'] text-2xl font-bold">
            {formatCurrency(amount)}
          </p>
        </div>
      )}

      {/* Response code badge for failed */}
      {status === "failed" && responseCode && (
        <p className="text-[#555555] font-['Inter'] text-xs">
          Reference code: {responseCode}
        </p>
      )}

      {/* Actions */}
      {!isLoading && (
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={config.primaryAction === "retry" ? onRetry : onHome}
            className="w-full h-12 bg-[#E8C547] text-[#0C0C0C] font-['Inter'] font-semibold text-sm rounded-xl hover:bg-[#D4B23A] transition-colors duration-200"
          >
            {config.primaryLabel}
          </button>

          {config.showSecondary && (
            <button
              onClick={onHome}
              className="w-full h-12 bg-transparent border border-[#2A2A2A] text-[#888888] font-['Inter'] text-sm rounded-xl hover:border-[#3A3A3A] hover:text-[#F5F5F3] transition-colors duration-200"
            >
              Back to Home
            </button>
          )}
        </div>
      )}
    </div>
  );
}
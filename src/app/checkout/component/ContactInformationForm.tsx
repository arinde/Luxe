import { FormField } from "./FormField";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useEffect, useState } from "react";

interface ContactInfo {
  fullName: string;
  email: string;
  phoneNumber: string;
}

interface ContactInformationFormProps {
  values: ContactInfo;
  errors: Partial<ContactInfo>;
  onChange: (field: keyof ContactInfo, value: string) => void;
}

// Nigeria flag component
function NigeriaFlag() {
  return (
    <div className="w-6 h-4 rounded overflow-hidden flex-shrink-0">
      <div className="flex h-full">
        <div className="w-1/3 bg-[#008751]" />
        <div className="w-1/3 bg-white" />
        <div className="w-1/3 bg-[#008751]" />
      </div>
    </div>
  );
}

export function ContactInformationForm({
  values,
  errors,
  onChange,
}: ContactInformationFormProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Parse phone value for display
  const parsePhoneValue = (value: string): string | undefined => {
    if (!value) return undefined;
    // If already in E.164 format with +, use as is
    if (value.startsWith("+")) return value;
    // If starts with 0, convert to +234 format
    if (value.startsWith("0")) {
      return "+234" + value.slice(1);
    }
    // Otherwise assume it's the number without country code
    return "+234" + value;
  };

  const handlePhoneChange = (value: string | undefined) => {
    // Store the full E.164 number
    onChange("phoneNumber", value || "");
  };

  const phoneValue = parsePhoneValue(values.phoneNumber);

  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-6">
      <h2 className="text-[#F5F5F3] text-lg font-semibold font-syne mb-6">
        Contact information
      </h2>

      <div className="flex flex-col gap-5">
        <FormField
          label="Full Name"
          placeholder="Adaeze Okonkwo"
          value={values.fullName}
          onChange={(v) => onChange("fullName", v)}
          error={errors.fullName}
        />
        <FormField
          label="Email"
          type="email"
          placeholder="[EMAIL_REDACTED]"
          value={values.email}
          onChange={(v) => onChange("email", v)}
          error={errors.email}
        />
        
        {/* Phone Number - Nigeria Only */}
        <div className="flex flex-col gap-2">
          <label 
            htmlFor="phone"
            className="text-[#888888] text-[11px] uppercase tracking-[0.12em]"
          >
            Phone Number
          </label>
          <div
            className={`phone-input-ng w-full ${errors.phoneNumber ? 'error' : ''}`}
          >
            {!mounted ? (
              // Server-side placeholder
              <div className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl px-5 py-4 text-[#F5F5F3] text-sm">
                <span className="text-[#444444]">810 123 4567</span>
              </div>
            ) : (
              <div className="flex items-center w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden focus-within:border-[#E8C547] focus-within:shadow-[0_0_0_2px_rgba(232,197,71,0.1)] transition-all">
                {/* Fixed Nigeria prefix */}
                <div className="flex items-center gap-2 px-4 py-4 border-r border-[#2A2A2A] bg-[#161616]">
                  <NigeriaFlag />
                  <span className="text-[#F5F5F3] text-sm font-medium whitespace-nowrap">+234</span>
                </div>
                {/* Phone input */}
                <PhoneInput
                  id="phone"
                  international={false}
                  defaultCountry="NG"
                  countries={["NG"]}
                  value={phoneValue}
                  onChange={handlePhoneChange}
                  placeholder="810 123 4567"
                  className="flex-1 phone-input-field"
                />
              </div>
            )}
          </div>
          {errors.phoneNumber && (
            <p className="text-red-400 text-[11px]">{errors.phoneNumber}</p>
          )}
          <p className="text-[11px] text-[#666666]">
            Enter your Nigerian phone number (e.g., 810 123 4567)
          </p>
        </div>
      </div>
    </div>
  );
}

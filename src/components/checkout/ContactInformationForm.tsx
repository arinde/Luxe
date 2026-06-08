import { FormField } from "./FormField";

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

export function ContactInformationForm({
  values,
  errors,
  onChange,
}: ContactInformationFormProps) {
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
          placeholder="adaeze@example.com"
          value={values.email}
          onChange={(v) => onChange("email", v)}
          error={errors.email}
        />
        <FormField
          label="Phone Number"
          type="tel"
          placeholder="+234 801 234 5678"
          value={values.phoneNumber}
          onChange={(v) => onChange("phoneNumber", v)}
          error={errors.phoneNumber}
        />
      </div>
    </div>
  );
}
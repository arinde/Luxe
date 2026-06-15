import { FormField } from "./FormField";

interface DeliveryAddress {
  address: string;
}

interface DeliveryAddressFormProps {
  values: DeliveryAddress;
  errors: Partial<DeliveryAddress>;
  onChange: (field: keyof DeliveryAddress, value: string) => void;
}

export function DeliveryAddressForm({
  values,
  errors,
  onChange,
}: DeliveryAddressFormProps) {
  return (
    <div className="rounded-2xl border border-[#2A2A2A] bg-[#141414] p-6">
      <h2 className="text-[#F5F5F3] text-lg font-semibold font-syne mb-6">
        Delivery address
      </h2>

      <FormField
        label="Address"
        placeholder="12 Bode Thomas Street, Lagos"
        value={values.address}
        onChange={(v) => onChange("address", v)}
        error={errors.address}
      />
    </div>
  );
}
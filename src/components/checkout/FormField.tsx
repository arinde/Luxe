interface FormFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function FormField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[#888888] text-[11px] uppercase tracking-[0.12em]">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-[#1A1A1A] border ${
          error ? "border-red-500" : "border-[#2A2A2A]"
        } rounded-xl px-5 py-4 text-[#F5F5F3] text-sm placeholder:text-[#444444] focus:outline-none focus:border-[#E8C547] transition-colors duration-200`}
      />
      {error && (
        <p className="text-red-400 text-[11px]">{error}</p>
      )}
    </div>
  );
}
interface BadgeProps {
  children: React.ReactNode;
  variant?: "brand" | "success";
  className?: string;
}

export function Badge({
  children,
  variant = "brand",
  className = "",
}: BadgeProps) {
  const styles =
    variant === "brand"
      ? "bg-brand-600 text-white"
      : "bg-success-500 text-white";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles} ${className}`}
    >
      {children}
    </span>
  );
}

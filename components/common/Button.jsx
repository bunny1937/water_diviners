import styles from "./Button.module.css";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  onClick,
  type = "button",
  ...props
}) {
  const sizeClass =
    {
      sm: styles.small,
      md: "",
      lg: styles.large,
    }[size] || "";

  const variantClass =
    {
      primary: styles.primary,
      secondary: styles.secondary,
      outline: styles.outline,
      success: styles.success,
      link: styles.link,
    }[variant] || styles.primary;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${styles.button} ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

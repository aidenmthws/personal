import type { ComponentProps } from "react";

function CardRoot({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`overflow-hidden rounded-sm border-keyline border-border bg-card text-card-foreground ${className}`}
      {...props}
    />
  );
}

function CardHeader({ children, className = "", ...props }: ComponentProps<"div">) {
  return (
    <div className={className} {...props}>
      <div aria-hidden="true" className="kasavu-cap" />
      <div className="px-6 pt-6">{children}</div>
    </div>
  );
}

function CardBody({ className = "", ...props }: ComponentProps<"div">) {
  return <div className={`p-6 ${className}`} {...props} />;
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
});

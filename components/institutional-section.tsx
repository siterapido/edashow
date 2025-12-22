import { cn } from "@/lib/utils";

interface InstitutionalSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function InstitutionalSection({
  title,
  children,
  className,
  id,
}: InstitutionalSectionProps) {
  return (
    <section id={id} className={cn("mb-12 md:mb-16", className)}>
      <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-foreground">
        {title}
      </h2>
      <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-ul:text-muted-foreground prose-li:text-muted-foreground">
        {children}
      </div>
    </section>
  );
}









import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  return (
    <nav className={cn("flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] font-bold text-ink/40", className)}>
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="hover:text-ink transition-colors"
      >
        Home
      </button>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={10} className="text-ink/20" />
          {index === items.length - 1 ? (
            <span className="text-ink/80">{item.label}</span>
          ) : (
            <button 
              onClick={item.onClick}
              className="hover:text-ink transition-colors"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;

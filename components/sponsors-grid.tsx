import { Card, CardContent } from "@/components/ui/card";
import { getImageUrl } from "@/lib/payload/api";

interface SponsorsGridProps {
  sponsors: any[];
}

export function SponsorsGrid({ sponsors }: SponsorsGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {sponsors.map((sponsor, index) => {
        const logoUrl = typeof sponsor === 'string' 
          ? `/sponsors/${sponsor}` 
          : getImageUrl(sponsor.logo);
          
        return (
          <Card key={index} className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white border-slate-100 hover:border-primary/20 overflow-hidden">
            <CardContent className="p-6 flex items-center justify-center w-full aspect-square relative bg-white">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={logoUrl}
                  alt={sponsor.name || `Patrocinador ${index + 1}`}
                  className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}







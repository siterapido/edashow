import { ExternalLink, Award } from 'lucide-react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { getImageUrl } from '@/lib/payload/api'

interface Sponsor {
  name: string
  logo?: any
  website?: string
  sponsorshipType?: 'gold' | 'silver' | 'bronze'
}

interface EventSponsorsProps {
  sponsors?: Sponsor[]
  className?: string
}

const sponsorshipColors = {
  gold: {
    bg: 'bg-gradient-to-br from-yellow-100 via-amber-100 to-yellow-50',
    border: 'border-yellow-400 border-2',
    badge: 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white',
    label: 'Patrocínio Ouro'
  },
  silver: {
    bg: 'bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100',
    border: 'border-orange-300 border-2',
    badge: 'bg-gradient-to-r from-orange-400 to-amber-400 text-white',
    label: 'Patrocínio Prata'
  },
  bronze: {
    bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
    border: 'border-orange-200 border-2',
    badge: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white',
    label: 'Patrocínio Bronze'
  }
}

export function EventSponsors({ sponsors, className }: EventSponsorsProps) {
  if (!sponsors || sponsors.length === 0) {
    return null
  }

  // Agrupar por tipo de patrocínio
  const groupedSponsors = {
    gold: sponsors.filter(s => s.sponsorshipType === 'gold'),
    silver: sponsors.filter(s => s.sponsorshipType === 'silver'),
    bronze: sponsors.filter(s => s.sponsorshipType === 'bronze'),
    other: sponsors.filter(s => !s.sponsorshipType)
  }

  const renderSponsorGroup = (groupSponsors: Sponsor[], type: 'gold' | 'silver' | 'bronze' | 'other') => {
    if (groupSponsors.length === 0) return null

    const colors = type !== 'other' ? sponsorshipColors[type] : {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      badge: 'bg-gray-400 text-white',
      label: 'Patrocinadores'
    }

    return (
      <div key={type} className="mb-8">
        {type !== 'other' && (
          <div className="flex items-center gap-2 mb-4">
            <Award className={`h-5 w-5 ${colors.badge.replace('bg-', 'text-')}`} />
            <h3 className="text-xl font-bold text-gray-900">{colors.label}</h3>
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {groupSponsors.map((sponsor, index) => {
            const logoUrl = sponsor.logo 
              ? (typeof sponsor.logo === 'string' ? sponsor.logo : getImageUrl(sponsor.logo, 'card'))
              : '/placeholder-logo.png'

            return (
              <Card 
                key={index}
                className={`p-4 hover:shadow-xl hover:scale-105 transition-all cursor-pointer ${colors.bg} ${colors.border}`}
              >
                {sponsor.website ? (
                  <a 
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="relative h-20 w-full mb-3">
                      <Image
                        src={logoUrl}
                        alt={sponsor.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 truncate flex-1">
                        {sponsor.name}
                      </p>
                      <ExternalLink className="h-4 w-4 text-gray-400 shrink-0 ml-1" />
                    </div>
                  </a>
                ) : (
                  <>
                    <div className="relative h-20 w-full mb-3">
                      <Image
                        src={logoUrl}
                        alt={sponsor.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {sponsor.name}
                    </p>
                  </>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <section className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Empresas Patrocinadoras</h2>
        <p className="text-gray-600">Agradecemos aos nossos patrocinadores que tornam este evento possível</p>
      </div>

      {renderSponsorGroup(groupedSponsors.gold, 'gold')}
      {renderSponsorGroup(groupedSponsors.silver, 'silver')}
      {renderSponsorGroup(groupedSponsors.bronze, 'bronze')}
      {renderSponsorGroup(groupedSponsors.other, 'other')}
    </section>
  )
}













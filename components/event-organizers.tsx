import { Mail, Building2, User } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

interface Organizer {
  name: string
  company: string
  email?: string
  photo?: any
  photoUrl?: string
  role?: string
}

interface EventOrganizersProps {
  organizers?: Organizer[]
  className?: string
}

export function EventOrganizers({ organizers, className }: EventOrganizersProps) {
  if (!organizers || organizers.length === 0) {
    return null
  }

  return (
    <section className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Organizadores</h2>
        <p className="text-gray-600">Conheça quem está organizando este evento</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {organizers.map((organizer, index) => (
          <Card key={index} className="p-5 hover:shadow-xl transition-all border-2 border-orange-100 hover:border-orange-300 bg-gradient-to-br from-white to-orange-50/30">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 shrink-0 border-2 border-orange-300">
                {organizer.photo ? (
                  <AvatarImage
                    src={typeof organizer.photo === 'string'
                      ? organizer.photo
                      : (organizer.photo.url || organizer.photoUrl)}
                    alt={organizer.name}
                  />
                ) : (
                  <AvatarImage
                    src="/logo-dark.png"
                    alt="EDA Show Logo"
                    className="object-contain p-2 bg-white"
                  />
                )}
                <AvatarFallback className="bg-white">
                  <Image
                    src="/logo-dark.png"
                    alt="EDA Show Logo"
                    width={64}
                    height={64}
                    className="object-contain p-2"
                  />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{organizer.name}</h3>

                {organizer.role && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <User className="h-3.5 w-3.5 text-orange-600" />
                    <p className="text-sm text-gray-700 font-medium">{organizer.role}</p>
                  </div>
                )}

                <div className="flex items-center gap-1.5 mb-2">
                  <Building2 className="h-3.5 w-3.5 text-orange-600" />
                  <p className="text-sm font-semibold text-orange-700 truncate">{organizer.company}</p>
                </div>

                {organizer.email && (
                  <a
                    href={`mailto:${organizer.email}`}
                    className="flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{organizer.email}</span>
                  </a>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}














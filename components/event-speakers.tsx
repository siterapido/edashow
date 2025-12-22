import { Building2, User, Mic } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { getImageUrl } from '@/lib/payload/api'
import Image from 'next/image'

interface Speaker {
  name: string
  photo?: any
  company: string
  role: string
  bio?: string
  talkTitle?: string
}

interface EventSpeakersProps {
  speakers?: Speaker[]
  className?: string
}

export function EventSpeakers({ speakers, className }: EventSpeakersProps) {
  if (!speakers || speakers.length === 0) {
    return null
  }

  return (
    <section className={className}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Palestrantes</h2>
        <p className="text-gray-600">Conheça os especialistas que compartilharão conhecimento no evento</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {speakers.map((speaker, index) => (
          <Card key={index} className="p-6 hover:shadow-xl transition-all group border-2 border-orange-100 hover:border-orange-300 bg-gradient-to-br from-white to-amber-50/30">
            <div className="flex flex-col items-center text-center mb-4">
              <Avatar className="h-24 w-24 mb-4 border-4 border-orange-300 group-hover:border-orange-500 transition-colors">
                {speaker.photo ? (
                  <AvatarImage 
                    src={typeof speaker.photo === 'string' 
                      ? speaker.photo 
                      : getImageUrl(speaker.photo, 'thumbnail')} 
                    alt={speaker.name} 
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
                    width={96}
                    height={96}
                    className="object-contain p-2"
                  />
                </AvatarFallback>
              </Avatar>

              <h3 className="font-bold text-xl text-gray-900 mb-1">{speaker.name}</h3>
              
              <div className="flex items-center gap-1.5 mb-2 text-sm text-orange-700">
                <User className="h-4 w-4" />
                <span className="font-medium">{speaker.role}</span>
              </div>

              <div className="flex items-center gap-1.5 mb-4 text-sm font-semibold text-orange-600">
                <Building2 className="h-4 w-4" />
                <span>{speaker.company}</span>
              </div>
            </div>

            {speaker.talkTitle && (
              <div className="mb-4 pt-4 border-t border-gray-200">
                <div className="flex items-start gap-2">
                  <Mic className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Palestra</p>
                    <p className="text-sm font-semibold text-gray-900">{speaker.talkTitle}</p>
                  </div>
                </div>
              </div>
            )}

            {speaker.bio && (
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                {speaker.bio}
              </p>
            )}
          </Card>
        ))}
      </div>
    </section>
  )
}













export function AdBanners() {
  return (
    <section className="w-full py-4">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-4">
          {/* App Download Banner */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-white flex items-center justify-between min-h-[200px]">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Baixe nosso App</h3>
              <p className="text-sm">O Cotador de planos de saúde na palma da sua mão.</p>
            </div>
          </div>

          {/* Cotador Banner */}
          <div className="bg-gradient-to-r from-gray-600 to-teal-700 rounded-lg p-8 text-white flex items-center justify-center min-h-[200px]">
            <div className="bg-white text-gray-800 p-8 rounded-lg">
              <div className="text-4xl font-bold mb-2">C | S</div>
              <p className="text-sm">
                Cotador
                <br />
                Simplificado
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import React from "react";

export default function StorySection() {
  return (
    <section className="py-20 px-4 bg-white" id="historia">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
        
        {/* Image Placeholder */}
        <div className="w-full md:w-1/2">
          <div className="aspect-[4/5] bg-cream rounded-2xl relative overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm">
            <div className="text-center p-8">
              <span className="text-6xl mb-4 block">👩‍🍳</span>
              <p className="text-gray-500 font-serif italic">Foto de Doña Martha en la Feria</p>
            </div>
            
            {/* 30 Years Badge */}
            <div className="absolute top-6 left-6 bg-terracotta text-white font-bold py-3 px-4 rounded-lg shadow-lg transform -rotate-3">
              <span className="block text-2xl">+30</span>
              <span className="block text-xs uppercase tracking-wider">Años de Tradición</span>
            </div>
          </div>
        </div>
        
        {/* Story Content */}
        <div className="w-full md:w-1/2">
          <h2 className="text-sm font-bold tracking-widest text-foliage uppercase mb-3">Nuestra Herencia</h2>
          <h3 className="text-4xl font-serif text-gray-900 mb-6 leading-tight">
            De nuestras manos a su mesa, sin atajos.
          </h3>
          
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              Por más de tres décadas, nuestra familia se ha levantado de madrugada para cuidar la leche 
              más fresca y transformarla en los quesos artesanales que usted conoce y confía. 
            </p>
            <p>
              No creemos en procesos industriales masivos ni en alterar los sabores con químicos. 
              Creemos en el <strong>trato humano</strong>, en el queso hilado a mano, y en el sabor a campo 
              que solo se logra cuando las cosas se hacen con amor y paciencia.
            </p>
            <p>
              Hoy, damos un paso más para estar más cerca de usted. Llevamos la calidez y frescura de nuestro 
              puesto en la feria directamente hasta la puerta de su casa, garantizando siempre el 
              sabor tradicional que nos caracteriza.
            </p>
          </div>
          
          <div className="mt-10">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-cream rounded-full flex items-center justify-center text-terracotta text-2xl font-serif font-bold italic">
                M
              </div>
              <div>
                <p className="font-bold text-gray-900">Familia Doña Martha</p>
                <p className="text-gray-500 text-sm">Fundadores, La Central del Queso</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}

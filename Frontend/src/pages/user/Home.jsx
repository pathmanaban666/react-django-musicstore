import { Link } from 'react-router-dom';

const features = [
  {
    id: 1,
    title: "Wide Selection",
    description: "From guitars to keyboards, explore thousands of quality instruments.",
    icon: (
      <svg
    className="w-12 h-12 text-purple-600"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
    ),
  },
  {
    id: 2,
    title: "Quality Guarantee",
    description: "Every instrument is inspected to meet high standards of sound and craftsmanship.",
    icon: (
      <svg
        className="w-12 h-12 text-purple-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Fast Shipping",
    description: "Quick and safe delivery right to your door.",
    icon: (
       <svg
    className="w-12 h-12 text-purple-600"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 3h13v13H3z" />
    <path d="M16 8h5l2 3v5h-7z" />
    <circle cx="7.5" cy="18.5" r="2.5" />
    <circle cx="17.5" cy="18.5" r="2.5" />
  </svg>
    ),
  },
];


export default function Home() {
  return (
    <div className="bg-gradient-to-b from-purple-50 to-white">
      <section className="container mx-auto px-6 pt-16 text-center md:text-left grid md:grid-cols-2 gap-8 items-center">
        <div className="lg:mx-10">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-purple-900">
            Find Your Perfect Music Instrument
          </h1>
          <p className="mt-6 max-w-xl text-lg text-gray-700">
            Discover premium guitars, drums, keyboards, and more, crafted for every style and skill level. Your next great sound starts here.
          </p>
          <Link
            to="/products"
            className="mt-8 inline-block px-8 py-3 bg-purple-700 text-white font-bold rounded hover:bg-purple-800 transition duration-300"
          >
            Shop Now
          </Link>
        </div>
        <div>
          <img
            src="https://img.freepik.com/premium-photo/collection-musical-instruments-including-one-instruments_662214-63334.jpg"
            alt="Musical instruments"
            className="rounded-lg shadow-lg w-full max-w-md mx-auto md:mx-0"
          />
        </div>
      </section>

      <section className="container mx-auto px-6 mt-24">
        <h2 className="text-3xl font-bold text-purple-900 mb-10 text-center">
          Featured Instruments
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[
            {
              name: "Acoustic Guitar",
              image:
                "https://guitar.com/wp-content/uploads/2024/01/martin-guitar-remastered-x-series@2000x1500.jpg"
            },
            {
              name: "Electric Keyboard",
              image:
                "https://images-na.ssl-images-amazon.com/images/I/719MxVUVvPL._AC_SL1500_.jpg"
            },
            {
              name: "Jazz Drum Set",
              image:
                "https://images.squarespace-cdn.com/content/v1/559b3d1fe4b0167e53053fa2/1603920078730-27TWUB5MRWA50T6ZN7US/IMG_0664.jpg"
            },
            {
              name: "Bass Guitar",
              image:
                "https://geraldmusique.ca/wp-content/uploads/2023/01/IMG_1383-scaled.jpg"
            },
          ].map((instrument) => (
            <div
              key={instrument.name}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                className="w-full h-48 object-cover"
                src={instrument.image}
                alt={instrument.name}
              />
              <div className="p-4">
                <h3 className="text-xl text-center font-semibold text-purple-900">
                  {instrument.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-6 py-20">
        <h2 className="text-center text-4xl font-bold mb-14">Why Choose Us?</h2>
        <div className="flex flex-wrap justify-center gap-16 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="w-72 flex flex-col items-center text-center space-y-6 px-4"
            >
              {feature.icon}
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

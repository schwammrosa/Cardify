import { Star, ExternalLink, ShoppingCart } from 'lucide-react'

export default function ProductCard({ product }) {
  const { title, image, price, rating, features, affiliateUrl, availability, author } = product

  return (
    <div className="card max-w-sm hover:scale-105 transition-transform duration-300">
      {/* Imagem do Produto */}
      {image?.large && (
        <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-50">
          <img
            src={image.large}
            alt={title}
            className="w-full h-64 object-contain"
          />
        </div>
      )}

      {/* Título */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
        {title}
      </h3>

      {/* Autor/Marca */}
      {author && (
        <p className="text-sm text-gray-600 mb-3">
          por <span className="font-semibold">{author}</span>
        </p>
      )}

      {/* Avaliações */}
      {rating?.stars && (
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(rating.stars)
                    ? 'fill-amazon-orange text-amazon-orange'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {rating.stars} {rating.count && `(${rating.count})`}
          </span>
        </div>
      )}

      {/* Features */}
      {features?.length > 0 && (
        <ul className="text-sm text-gray-600 mb-4 space-y-1">
          {features.slice(0, 3).map((feature, index) => (
            <li key={index} className="line-clamp-1">
              • {feature}
            </li>
          ))}
        </ul>
      )}

      {/* Preço e CTA */}
      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            {price?.display && (
              <p className="text-2xl font-bold text-amazon-dark">
                {price.display}
              </p>
            )}
            {availability?.message && (
              <p className="text-xs text-gray-500 mt-1">
                {availability.message}
              </p>
            )}
          </div>
        </div>

        <a
          href={affiliateUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Ver na Amazon
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Disclosure Amazon Associates */}
      <p className="text-xs text-gray-500 mt-3 text-center italic">
        As an Amazon Associate I earn from qualifying purchases.
      </p>
    </div>
  )
}

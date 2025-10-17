import { ShoppingCart } from 'lucide-react'

// Preview do Template Horizontal
function HorizontalPreview({ product }) {
  return (
    <div className="flex flex-wrap items-center gap-5 border border-gray-300 rounded-lg p-5 max-w-3xl">
      {/* Imagem */}
      <div className="flex-1 min-w-[200px] text-center">
        <img
          src={product.image?.large || ''}
          alt={product.title}
          className="w-full max-w-[250px] rounded-lg mx-auto"
        />
      </div>
      
      {/* Conteúdo */}
      <div className="flex-[2] min-w-[250px]">
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
          {product.title}
        </h3>
        
        {/* Autor/Marca */}
        {product.author && (
          <p className="text-sm text-gray-600 mb-3">
            por <span className="font-semibold">{product.author}</span>
          </p>
        )}
        
        {/* Features */}
        {product.features && product.features.length > 0 && (
          <ul className="text-sm text-gray-700 mb-3 space-y-1">
            {product.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}
        
        {product.price?.display && (
          <p className="text-2xl font-bold text-[#B12704] mb-3">
            {product.price.display}
          </p>
        )}
        
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="nofollow sponsored"
          className="block bg-[#1976d2] text-white text-center py-2.5 px-4 rounded-md font-semibold hover:bg-[#125a9c] transition-colors"
        >
          Comprar na Amazon
        </a>
      </div>
    </div>
  )
}

// Preview do Template Vertical
function VerticalPreview({ product }) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl p-4 text-center shadow-md hover:-translate-y-1 transition-transform max-w-[280px] mx-auto">
      <h3 className="text-base font-semibold mb-3 text-gray-800 line-clamp-2">
        {product.title}
      </h3>
      
      <img
        src={product.image?.large || ''}
        alt={product.title}
        className="w-full rounded-lg mb-3"
      />
      
      {/* Autor/Marca */}
      {product.author && (
        <p className="text-xs text-gray-600 mb-2">
          por <span className="font-semibold">{product.author}</span>
        </p>
      )}
      
      {/* Features */}
      {product.features && product.features.length > 0 && (
        <ul className="text-xs text-left text-gray-700 mb-3 space-y-1">
          {product.features.slice(0, 3).map((feature, idx) => (
            <li key={idx} className="flex items-start gap-1">
              <span className="text-gray-400">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}
      
      {product.price?.display && (
        <p className="text-2xl font-bold text-[#B12704] mb-3">
          {product.price.display}
        </p>
      )}
      
      <a
        href={product.affiliateUrl}
        target="_blank"
        rel="nofollow sponsored"
        className="block bg-[#1976d2] text-white py-2.5 rounded-md font-semibold hover:bg-[#125a9c] transition-colors"
      >
        Comprar na Amazon
      </a>
    </div>
  )
}

export default function TemplatePreview({ product, template }) {
  return (
    <div className="card bg-gray-50">
      <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300">
        {template === 'horizontal' && <HorizontalPreview product={product} />}
        {template === 'vertical' && <VerticalPreview product={product} />}
      </div>
    </div>
  )
}

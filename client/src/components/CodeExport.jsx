import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { generateHorizontalTemplate, generateVerticalTemplate } from '../utils/templateGenerators'

export default function CodeExport({ product, template = 'horizontal' }) {
  const [copied, setCopied] = useState(false)
  const [format, setFormat] = useState('html')

  const generateHTMLCode = () => {
    // Gerar código baseado no template selecionado
    switch (template) {
      case 'horizontal':
        return generateHorizontalTemplate(product)
      case 'vertical':
        return generateVerticalTemplate(product)
      default:
        return generateHorizontalTemplate(product)
    }
  }

  const generateReactCode = () => {
    return `import { ShoppingCart, Star } from 'lucide-react'

export default function AmazonProductCard() {
  return (
    <div className="max-w-sm bg-white rounded-xl shadow-lg p-6">
      ${product.image?.large ? `<img 
        src="${product.image.large}" 
        alt="${product.title}"
        className="w-full h-64 object-contain rounded-lg mb-4 bg-gray-50"
      />` : ''}
      
      <h3 className="text-lg font-bold text-gray-900 mb-2">
        ${product.title}
      </h3>
      
      ${product.author ? `<p className="text-sm text-gray-600 mb-3">
        por <span className="font-semibold">${product.author}</span>
      </p>` : ''}
      
      ${product.rating?.stars ? `<div className="flex items-center gap-2 mb-3">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={\`w-4 h-4 \${i < ${Math.round(product.rating.stars)} ? 'fill-orange-500 text-orange-500' : 'text-gray-300'}\`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">
          ${product.rating.stars} ${product.rating.count ? `(${product.rating.count})` : ''}
        </span>
      </div>` : ''}
      
      ${product.features?.length > 0 ? `<ul className="text-sm text-gray-600 mb-4 space-y-1">
        ${product.features.slice(0, 3).map(f => `<li>• ${f}</li>`).join('\n        ')}
      </ul>` : ''}
      
      <div className="pt-4 border-t border-gray-200">
        ${product.price?.display ? `<p className="text-2xl font-bold text-gray-900 mb-3">
          ${product.price.display}
        </p>` : ''}
        
        <a
          href="${product.affiliateUrl}"
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          Ver na Amazon
        </a>
      </div>
      
      <p className="text-xs text-gray-500 text-center mt-3 italic">
        As an Amazon Associate I earn from qualifying purchases.
      </p>
    </div>
  )
}`
  }

  const generateJSONCode = () => {
    return JSON.stringify(product, null, 2)
  }

  const getCode = () => {
    switch (format) {
      case 'html':
        return generateHTMLCode()
      case 'react':
        return generateReactCode()
      case 'json':
        return generateJSONCode()
      default:
        return ''
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getCode())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFormat('html')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              format === 'html'
                ? 'bg-amazon-orange text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            HTML
          </button>
          <button
            onClick={() => setFormat('react')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              format === 'react'
                ? 'bg-amazon-orange text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            React/JSX
          </button>
          <button
            onClick={() => setFormat('json')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              format === 'json'
                ? 'bg-amazon-orange text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            JSON
          </button>
        </div>

        <button
          onClick={handleCopy}
          className="btn-secondary flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copiar
            </>
          )}
        </button>
      </div>

      <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm">
        <code>{getCode()}</code>
      </pre>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Dica:</strong> {format === 'html' && 'Cole este código direto no seu HTML'}
          {format === 'react' && 'Use este componente no seu projeto React'}
          {format === 'json' && 'Use estes dados para criar seu próprio layout'}
        </p>
      </div>
    </div>
  )
}

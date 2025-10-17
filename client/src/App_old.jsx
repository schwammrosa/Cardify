import { useState } from 'react'
import { Search, Package, Code, Copy, Check, AlertCircle, Loader2 } from 'lucide-react'
import ProductCard from './components/ProductCard'
import CodeExport from './components/CodeExport'
import TemplateSelector from './components/TemplateSelector'
import TemplatePreview from './components/TemplatePreview'

function App() {
  const [asin, setAsin] = useState('')
  const [tag, setTag] = useState('')
  const [marketplace, setMarketplace] = useState('us')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [product, setProduct] = useState(null)
  const [showCode, setShowCode] = useState(false)
  const [demoMode, setDemoMode] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('horizontal')

  const marketplaces = [
    { value: 'us', label: '🇺🇸 Estados Unidos' },
    { value: 'br', label: '🇧🇷 Brasil' },
    { value: 'uk', label: '🇬🇧 Reino Unido' },
    { value: 'ca', label: '🇨🇦 Canadá' },
    { value: 'de', label: '🇩🇪 Alemanha' },
    { value: 'es', label: '🇪🇸 Espanha' },
    { value: 'fr', label: '🇫🇷 França' },
    { value: 'it', label: '🇮🇹 Itália' },
    { value: 'jp', label: '🇯🇵 Japão' }
  ]

  const loadDemoProduct = () => {
    // Produto de demonstração com a imagem customizada
    const demoProduct = {
      asin: 'B08N5DEMO1',
      title: 'Alexa Echo Dot (5ª Geração) - Smart Speaker com Alexa',
      author: 'Amazon',
      image: {
        large: 'https://m.media-amazon.com/images/I/71i5jjOyOEL._AC_SX679_.jpg',
        medium: 'https://m.media-amazon.com/images/I/71i5jjOyOEL._AC_SX679_.jpg'
      },
      price: {
        amount: 349.00,
        display: 'R$ 349,00',
        currency: 'BRL'
      },
      availability: {
        message: 'Disponível na Amazon',
        type: 'Available'
      },
      features: [
        'Som de alta qualidade com áudio nítido',
        'Controle dispositivos smart home por voz',
        'Alexa com inteligência artificial'
      ],
      rating: {
        stars: 4.7,
        count: 52840
      },
      affiliateUrl: 'https://www.amazon.com.br/dp/B08N5DEMO1?tag=aquipagamenos-20',
      marketplace: 'br',
      isDemo: true
    }
    
    setProduct(demoProduct)
    setError(null)
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setProduct(null)

    try {
      const params = new URLSearchParams({
        asin,
        marketplace,
        ...(tag && { tag })
      })

      // Usar endpoint demo se modo demo estiver ativo
      const endpoint = demoMode ? `/api/demo/card` : `/api/card`
      const response = await fetch(`${endpoint}?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar produto')
      }

      setProduct(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="w-12 h-12 text-amazon-orange" />
            <h1 className="text-5xl font-bold text-amazon-dark">Cardify</h1>
          </div>
          <p className="text-xl text-gray-600">
            Gere cards profissionais para produtos da Amazon com seus links de afiliado
          </p>
          
          {/* Toggle Modo Demo */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                className="w-4 h-4 text-amazon-orange rounded focus:ring-2 focus:ring-amazon-orange"
              />
              <span className="text-sm font-medium text-gray-700">
                🎭 Modo Demonstração (sem gastar requisições da API)
              </span>
            </label>
          </div>
          
          {demoMode && (
            <div className="mt-3 max-w-2xl mx-auto bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <strong>Modo Demo Ativo:</strong> Use ASINs: B0CYV3SPH7, B08N5WRWNW, B0BSHF7WHW ou DEMO001
            </div>
          )}
        </header>

        {/* Form */}
        <div className="card max-w-3xl mx-auto mb-8">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ASIN do Produto *
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={asin}
                  onChange={(e) => setAsin(e.target.value.toUpperCase())}
                  placeholder="Ex: B08N5WRWNW"
                  className="input-field pl-11"
                  required
                  maxLength={10}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                O ASIN é o código único do produto na Amazon (10 caracteres)
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Marketplace
                </label>
                <select
                  value={marketplace}
                  onChange={(e) => setMarketplace(e.target.value)}
                  className="input-field"
                >
                  {marketplaces.map(m => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Associate Tag (opcional)
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="seu-tag-20"
                  className="input-field"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Deixe vazio para usar a tag padrão
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <button
                type="submit"
                disabled={loading || !asin}
                className="btn-primary flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando card...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Gerar Card
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={loadDemoProduct}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <Package className="w-5 h-5" />
                Ver Demonstração
              </button>
            </div>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="card max-w-3xl mx-auto mb-8 bg-red-50 border-2 border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Erro ao gerar card</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Product Card Preview */}
        {product && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                ✨ Card Gerado com Sucesso!
              </h2>
              <button
                onClick={() => setShowCode(!showCode)}
                className="btn-secondary flex items-center gap-2"
              >
                <Code className="w-5 h-5" />
                {showCode ? 'Ver Preview' : 'Ver Código'}
              </button>
            </div>

            {product.fromCache && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                ⚡ Resultado obtido do cache (mais rápido e economiza requisições à API)
              </div>
            )}

            {product.isDemo && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                🎭 <strong>Produto de Demonstração:</strong> Este é um exemplo para você visualizar os templates. Use um ASIN real para gerar cards de produtos da Amazon.
              </div>
            )}

            {product.fallbackReason && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-800">
                🌐 <strong>API Pública Ativa:</strong> {product.fallbackReason}
              </div>
            )}

            {product.isPublicAPI && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-sm text-indigo-800">
                🧪 <strong>Dados de Teste:</strong> Produto da {product.apiSource}. Interface funcional, dados podem não corresponder ao ASIN real.
              </div>
            )}

            {showCode ? (
              <>
                <TemplateSelector 
                  selectedTemplate={selectedTemplate}
                  onSelectTemplate={setSelectedTemplate}
                />
                
                <TemplatePreview 
                  product={product} 
                  template={selectedTemplate}
                />
                
                <CodeExport product={product} template={selectedTemplate} />
              </>
            ) : (
              <div className="flex justify-center">
                <ProductCard product={product} />
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="card text-center">
            <div className="w-12 h-12 bg-amazon-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-amazon-orange" />
            </div>
            <h3 className="font-bold text-lg mb-2">Busca Rápida</h3>
            <p className="text-gray-600 text-sm">
              Conectado à Amazon PA-API v5 para dados sempre atualizados
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-amazon-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="w-6 h-6 text-amazon-blue" />
            </div>
            <h3 className="font-bold text-lg mb-2">Código Pronto</h3>
            <p className="text-gray-600 text-sm">
              Exporte HTML ou React e use imediatamente no seu site
            </p>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Link Afiliado</h3>
            <p className="text-gray-600 text-sm">
              Seus links de afiliado já incluídos e compliance automático
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>
            Desenvolvido com ❤️ para Amazon Associates
          </p>
          <p className="mt-2">
            ⚠️ Certifique-se de ter suas credenciais PA-API configuradas no backend
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App

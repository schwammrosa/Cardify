import { useState, useEffect } from 'react'
import { Search, Package, Code, Settings, AlertCircle, Loader2 } from 'lucide-react'
import TemplateCards from './components/TemplateCards'
import TemplatePreview from './components/TemplatePreview'
import CodeExport from './components/CodeExport'
import SettingsModal from './components/SettingsModal'

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState('horizontal')
  const [asin, setAsin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [product, setProduct] = useState(null)
  const [showCode, setShowCode] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  
  // Configurações do usuário
  const [userSettings, setUserSettings] = useState(() => {
    const saved = localStorage.getItem('cardify_settings')
    return saved ? JSON.parse(saved) : null
  })

  // Usar valores das configurações do usuário
  const [tag, setTag] = useState('')
  const [marketplace, setMarketplace] = useState('br')
  
  useEffect(() => {
    if (userSettings) {
      setMarketplace(userSettings.marketplace)
      setTag(userSettings.associateTag)
    }
  }, [userSettings])

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

  // Salvar configurações
  const handleSaveSettings = (settings) => {
    localStorage.setItem('cardify_settings', JSON.stringify(settings))
    setUserSettings(settings)
    setMarketplace(settings.marketplace)
    setTag(settings.associateTag)
  }

  // Produto de demonstração
  const loadDemoProduct = () => {
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
    setShowCode(false)
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    
    // Validar se as configurações foram definidas
    if (!userSettings) {
      setError('Por favor, configure suas credenciais da Amazon PA-API primeiro.')
      setShowSettings(true)
      return
    }
    
    setLoading(true)
    setError(null)
    setProduct(null)
    setShowCode(false)

    try {
      const params = new URLSearchParams({
        asin,
        marketplace,
        tag: userSettings.associateTag,
        accessKey: userSettings.accessKey,
        secretKey: userSettings.secretKey
      })

      const response = await fetch(`/api/card?${params}`)
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
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10 relative">
          <button
            onClick={() => setShowSettings(true)}
            className="absolute right-0 top-0 btn-secondary flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Configurações
          </button>
          
          <div className="flex items-center justify-center gap-3 mb-3">
            <Package className="w-10 h-10 text-amazon-orange" />
            <h1 className="text-4xl font-bold text-amazon-dark">Cardify</h1>
          </div>
          <p className="text-lg text-gray-600">
            Gere cards profissionais para produtos da Amazon com seus links de afiliado
          </p>
        </header>

        {/* Aviso de Configuração */}
        {!userSettings && (
          <div className="card mb-8 bg-yellow-50 border-2 border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Configuração Necessária</h3>
                <p className="text-yellow-800 text-sm mb-3">
                  Para usar o Cardify, você precisa configurar suas credenciais da Amazon PA-API primeiro.
                </p>
                <button
                  onClick={() => setShowSettings(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Configurar Agora
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Template Selection */}
        <div className="card mb-8">
          <TemplateCards 
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
          />
        </div>

        {/* Preview do Template */}
        <div className="card mb-8">
          <div className="bg-gray-100 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <TemplatePreview 
              product={{
                title: 'Alexa Echo Dot (5ª Geração) - Smart Speaker com Alexa',
                author: 'Amazon',
                image: {
                  large: 'https://m.media-amazon.com/images/I/71i5jjOyOEL._AC_SX679_.jpg'
                },
                price: {
                  display: 'R$ 349,00'
                },
                features: [
                  'Som de alta qualidade com áudio nítido',
                  'Controle dispositivos smart home por voz',
                  'Alexa com inteligência artificial'
                ],
                affiliateUrl: '#'
              }}
              template={selectedTemplate}
            />
          </div>
        </div>

        {/* Form */}
        <div className="card mb-8">
          <form onSubmit={handleGenerate}>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              🔍 ASIN do Produto
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ASIN *
              </label>
              <input
                type="text"
                value={asin}
                onChange={(e) => setAsin(e.target.value.toUpperCase())}
                placeholder="Ex: B08N5WRWNW"
                className="input-field"
                required
                maxLength={10}
                disabled={!userSettings}
              />
              <p className="mt-1 text-xs text-gray-500">
                O ASIN é o código único do produto na Amazon (10 caracteres)
              </p>
            </div>

            {userSettings && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Marketplace:</strong> {marketplaces.find(m => m.value === marketplace)?.label || marketplace}
                  {' • '}
                  <strong>Associate Tag:</strong> {userSettings.associateTag}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !asin || !userSettings}
              className="btn-primary w-full flex items-center justify-center gap-2"
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
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="card mb-8 bg-red-50 border-2 border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Erro ao gerar card</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Card Gerado */}
        {product && (
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                🎉 Card Gerado com Sucesso!
              </h2>
              <button
                onClick={() => setShowCode(!showCode)}
                className="btn-primary flex items-center gap-2"
              >
                {showCode ? (
                  <>
                    <Package className="w-5 h-5" />
                    Ver Preview
                  </>
                ) : (
                  <>
                    <Code className="w-5 h-5" />
                    Ver Código
                  </>
                )}
              </button>
            </div>

            {product.isDemo && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 mb-6">
                🎭 <strong>Produto de Demonstração</strong> - Use um ASIN real para gerar cards de produtos da Amazon
              </div>
            )}

            {showCode ? (
              <CodeExport product={product} template={selectedTemplate} />
            ) : (
              <div className="bg-gray-100 p-6 rounded-lg">
                <TemplatePreview product={product} template={selectedTemplate} />
              </div>
            )}
          </div>
        )}

      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={handleSaveSettings}
        currentSettings={userSettings}
      />
    </div>
  )
}

export default App

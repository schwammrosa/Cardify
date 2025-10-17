import { useState, useEffect } from 'react'
import { X, Save, Settings } from 'lucide-react'

export default function SettingsModal({ isOpen, onClose, onSave, currentSettings }) {
  const [settings, setSettings] = useState({
    marketplace: 'br',
    associateTag: '',
    accessKey: '',
    secretKey: ''
  })

  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings)
    }
  }, [currentSettings])

  const handleSave = (e) => {
    e.preventDefault()
    onSave(settings)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amazon-orange rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
              <p className="text-sm text-gray-600">Configure suas credenciais da Amazon PA-API</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* Alert */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>🔐 Suas credenciais são salvas apenas no seu navegador</strong> e nunca são enviadas para nossos servidores.
            </p>
          </div>

          {/* Marketplace */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Marketplace Padrão *
            </label>
            <select
              value={settings.marketplace}
              onChange={(e) => setSettings({ ...settings, marketplace: e.target.value })}
              className="input-field"
              required
            >
              <option value="us">🇺🇸 Estados Unidos</option>
              <option value="br">🇧🇷 Brasil</option>
              <option value="uk">🇬🇧 Reino Unido</option>
              <option value="ca">🇨🇦 Canadá</option>
              <option value="de">🇩🇪 Alemanha</option>
              <option value="es">🇪🇸 Espanha</option>
              <option value="fr">🇫🇷 França</option>
              <option value="it">🇮🇹 Itália</option>
              <option value="jp">🇯🇵 Japão</option>
            </select>
          </div>

          {/* Associate Tag */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Associate Tag (Tracking ID) *
            </label>
            <input
              type="text"
              value={settings.associateTag}
              onChange={(e) => setSettings({ ...settings, associateTag: e.target.value })}
              placeholder="seu-tag-20"
              className="input-field"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Sua tag de afiliado da Amazon Associates
            </p>
          </div>

          {/* Access Key */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Access Key *
            </label>
            <input
              type="text"
              value={settings.accessKey}
              onChange={(e) => setSettings({ ...settings, accessKey: e.target.value })}
              placeholder="AKIAIOSFODNN7EXAMPLE"
              className="input-field font-mono text-sm"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Sua Access Key da Amazon Product Advertising API
            </p>
          </div>

          {/* Secret Key */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Secret Key *
            </label>
            <input
              type="password"
              value={settings.secretKey}
              onChange={(e) => setSettings({ ...settings, secretKey: e.target.value })}
              placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
              className="input-field font-mono text-sm"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Sua Secret Key da Amazon Product Advertising API
            </p>
          </div>

          {/* Help Link */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 mb-2">
              <strong>📚 Onde obter suas credenciais?</strong>
            </p>
            <a
              href="https://affiliate-program.amazon.com/assoc_credentials/home"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-amazon-blue hover:underline"
            >
              🔗 Amazon Associates - Credenciais da API
            </a>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

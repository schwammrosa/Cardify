import { Check, ArrowRight, LayoutList } from 'lucide-react'

export default function TemplateCards({ selectedTemplate, onSelectTemplate }) {
  const templates = [
    {
      id: 'horizontal',
      name: 'Horizontal',
      description: 'Imagem ao lado do conteúdo',
      icon: ArrowRight,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'vertical',
      name: 'Vertical',
      description: 'Card compacto vertical',
      icon: LayoutList,
      color: 'from-purple-500 to-purple-600'
    }
  ]

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        📋 Escolha o Template do Card
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id
          const Icon = template.icon
          
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className={`relative p-5 rounded-2xl border-2 transition-all text-left group ${
                isSelected
                  ? 'border-amazon-orange bg-gradient-to-br from-orange-50 to-white shadow-xl scale-105'
                  : 'border-gray-200 hover:border-amazon-orange/50 bg-white hover:shadow-lg'
              }`}
            >
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-amazon-orange text-white rounded-full p-1.5 shadow-lg">
                  <Check className="w-5 h-5" />
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${template.color} text-white shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${isSelected ? 'text-amazon-orange' : 'text-gray-900'}`}>
                    {template.name}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {template.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

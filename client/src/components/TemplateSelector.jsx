import { LayoutGrid, RectangleVertical, Square } from 'lucide-react'

const templates = [
  {
    id: 'horizontal',
    name: 'Horizontal',
    icon: Square,
    description: 'Card horizontal com imagem e conteúdo lado a lado'
  },
  {
    id: 'vertical',
    name: 'Vertical',
    icon: RectangleVertical,
    description: 'Card vertical único para produto'
  },
  {
    id: 'triple',
    name: 'Triplo',
    icon: LayoutGrid,
    description: 'Três produtos lado a lado'
  }
]

export default function TemplateSelector({ selectedTemplate, onSelectTemplate }) {
  return (
    <div className="card mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        📐 Escolha o Template do Card
      </h3>
      
      <div className="grid md:grid-cols-3 gap-4">
        {templates.map((template) => {
          const Icon = template.icon
          const isSelected = selectedTemplate === template.id
          
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-amazon-orange bg-orange-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${
                  isSelected ? 'bg-amazon-orange text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 ${
                    isSelected ? 'text-amazon-orange' : 'text-gray-900'
                  }`}>
                    {template.name}
                  </h4>
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

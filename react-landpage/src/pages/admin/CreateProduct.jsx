import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import { fetchManageCategoriesForSelect, createProduct } from '../../services/api';
import { SketchPicker } from 'react-color';
import ColorThief from 'colorthief';
import './CreateProduct.css';

const TAMANHOS_OPCOES = ['P', 'M', 'G', 'GG']; 
const NUMEROS_OPCOES = [
  { value: 'TRITA_E_SEIS', label: 36 },
  { value: 'TRITA_E_OITO', label: 38 },
  { value: 'QUARENTA', label: 40 },
  { value: 'QUARENTA_E_DOIS', label: 42 },
  { value: 'QUARENTA_E_QUATRO', label: 44 },
  { value: 'QUARENTA_E_SEIS', label: 46 }
];

const ColorPicker = ({ onColorSelect }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState('#ffffff');
  const handleClick = () => setDisplayColorPicker(!displayColorPicker);
  const handleCloseAndSelect = () => {
    onColorSelect(currentColor);
    setDisplayColorPicker(false);
  }
  const handleChange = (color) => setCurrentColor(color.hex);

  return (
    <div>
      <button type="button" onClick={handleClick} className="color-picker-button">Adicionar Cor Manualmente</button>
      {displayColorPicker && (
        <div className="color-picker-popover">
          <div className="color-picker-cover" onClick={handleCloseAndSelect} />
          <div className="sketch-picker-container">
            <SketchPicker color={currentColor} onChange={handleChange} disableAlpha={true} />
            <button type="button" onClick={handleCloseAndSelect} className="color-picker-confirm-button">Confirmar Cor</button>
          </div>
        </div>
      )}
    </div>
  );
};

const EstoqueManager = ({ customId, stockMap, onStockChange, isTamanho }) => {
  const options = isTamanho ? TAMANHOS_OPCOES : []; 
  
  const handleQuantityChange = (key, value) => {
    const newMap = { ...stockMap };
    
    if (value === '') {
      newMap[key] = ''; 
    } else {
      const quantity = parseInt(value, 10);
      newMap[key] = isNaN(quantity) ? 0 : quantity;
    }
    onStockChange(newMap);
  };

  const getLabel = (key) => {
      return key;
  };
  
  return (
    <div className="estoque-manager">
      <label>Estoque por Tamanho</label>
      <div className="estoque-manager-grid">
        {options
            .filter(key => stockMap.hasOwnProperty(key)) 
            .map(key => (
          <div key={key} className="estoque-item">
            <span className="estoque-label">{getLabel(key)}:</span>
            <input
              type="number"
              min="0"
              value={stockMap[key] === '' ? '' : stockMap[key]} 
              onChange={(e) => handleQuantityChange(key, e.target.value)}
              required
            />
          </div>
        ))}
        {options.filter(key => stockMap.hasOwnProperty(key)).length === 0 && (
            <p className="no-selection-message">Selecione uma opção de tamanho acima para adicionar o estoque.</p>
        )}
      </div>
    </div>
  );
}

const CreateProduct = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [product, setProduct] = useState({ nome: '', descricao: '', preco: '', categoriaId: '' });
  const [customizations, setCustomizations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) fetchManageCategoriesForSelect(token).then(setCategories);
  }, [token]);

  const handleProductChange = (e) => {
    setProduct(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleImageChange = (index, file) => {
    const newCustomizations = [...customizations];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    newCustomizations[index].imagem = file;
    newCustomizations[index].preview = previewURL;
    newCustomizations[index].isAnalyzing = true;
    newCustomizations[index].suggestedColors = [];
    setCustomizations(newCustomizations);

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = previewURL;
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 8);
        const hexPalette = palette.map(rgb => '#' + rgb.map(c => c.toString(16).padStart(2, '0')).join(''));

        setCustomizations(currentCustomizations => {
            const updated = [...currentCustomizations];
            if (updated[index]) {
              updated[index].suggestedColors = hexPalette;
              updated[index].isAnalyzing = false;
            }
            return updated;
        });
      } catch (e) {
        console.error('Erro ao extrair cores:', e);
        setCustomizations(currentCustomizations => {
            const updated = [...currentCustomizations];
            if (updated[index]) updated[index].isAnalyzing = false;
            return updated;
        });
      }
    };
    img.onerror = () => {
        console.error('Erro ao carregar a imagem para análise.');
        setCustomizations(currentCustomizations => {
            const updated = [...currentCustomizations];
            if (updated[index]) updated[index].isAnalyzing = false;
            return updated;
        });
    }
  };
  
  const handleCheckboxChange = (index, field, value) => {
    const newCustomizations = [...customizations];
    const currentValues = newCustomizations[index][field];
    
    if (currentValues.includes(value)) {
      newCustomizations[index][field] = currentValues.filter(item => item !== value);
      
      const stockField = field === 'tamanhos' ? 'estoqueTamanhos' : 'estoqueNumeros';
      const newStock = { ...newCustomizations[index][stockField] };
      delete newStock[value];
      newCustomizations[index][stockField] = newStock;
      
    } else {
      newCustomizations[index][field].push(value);
      
      const stockField = field === 'tamanhos' ? 'estoqueTamanhos' : 'estoqueNumeros';
      const newStock = { ...newCustomizations[index][stockField] };
      newStock[value] = 1; 
      newCustomizations[index][stockField] = newStock;
    }
    setCustomizations(newCustomizations);
  };
  
  const handleStockChange = (index, stockField, newStockMap) => {
      const newCustomizations = [...customizations];
      newCustomizations[index][stockField] = newStockMap;
      setCustomizations(newCustomizations);
  };

  const addCustomization = () => {
    setCustomizations([...customizations, {
      tamanhos: [], 
      numeros: [], 
      cores: [], 
      estoqueTamanhos: {}, 
      estoqueNumeros: {}, 
      imagem: null, 
      preview: null,
      suggestedColors: [], 
      isAnalyzing: false
    }]);
  };
  
  const removeCustomization = (index) => {
    setCustomizations(customizations.filter((_, i) => i !== index));
  };
  
  const addColorToCustomization = (index, color) => {
    const newCustomizations = [...customizations];
    if (color && !newCustomizations[index].cores.includes(color)) {
      newCustomizations[index].cores.push(color);
      setCustomizations(newCustomizations);
    }
  };

  const removeColorFromCustomization = (index, color) => {
    const newCustomizations = [...customizations];
    newCustomizations[index].cores = newCustomizations[index].cores.filter(c => c !== color);
    setCustomizations(newCustomizations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (customizations.length === 0) {
      setError('É obrigatório adicionar pelo menos uma variação.');
      return;
    }
    
    for (const cust of customizations) {
      const totalStockItems = Object.keys(cust.estoqueTamanhos).length;
      
      if (cust.tamanhos.length === 0) {
        setError('Cada variação deve ter pelo menos um tamanho selecionado.');
        return;
      }
      if (cust.cores.length === 0) {
        setError('Cada variação deve ter pelo menos uma cor.');
        return;
      }
      if (!cust.imagem) {
        setError('Cada variação deve ter uma imagem.');
        return;
      }
      
      if (totalStockItems === 0) {
        setError('Cada variação deve ter pelo menos um item de estoque com quantidade maior que zero.');
        return;
      }
      
      const allStockValues = Object.values(cust.estoqueTamanhos);
      
      if (allStockValues.some(q => q === '' || q === null || !Number.isInteger(q) || q <= 0)) {
          setError('Todas as quantidades de estoque devem ser números inteiros maiores que zero e preenchidas.');
          return;
      }
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('nome', product.nome);
    formData.append('descricao', product.descricao);
    formData.append('preco', product.preco);
    formData.append('categoriaId', product.categoriaId);

    customizations.forEach((cust, index) => {
      const finalEstoqueMap = cust.estoqueTamanhos; 
      
      Object.entries(finalEstoqueMap).forEach(([tamanhoOuNumero, quantidade]) => {
          formData.append(`produtoCustoms[${index}].estoque[${tamanhoOuNumero}]`, quantidade);
      });
      
      cust.cores.forEach(cor => formData.append(`produtoCustoms[${index}].cores`, cor));
      if (cust.imagem) {
        formData.append(`produtoCustoms[${index}].imagem`, cust.imagem);
      }
      
    });

    try {
      await createProduct(formData, token);
      console.log('Produto cadastrado com sucesso!');
      navigate('/admin/produtos'); 
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao cadastrar o produto.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-product-page">
      <div className="page-header">
        <h1>Cadastrar Novo Produto</h1>
        <button onClick={() => navigate('/admin/produtos')} className="back-button">Voltar</button>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-section">
          <h2>Dados Gerais</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nome">Nome do Produto</label>
              <input type="text" id="nome" name="nome" value={product.nome} onChange={handleProductChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="preco">Preço (ex: 89.90)</label>
              <input type="number" step="0.01" id="preco" name="preco" value={product.preco} onChange={handleProductChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="categoriaId">Categoria</label>
              <select id="categoriaId" name="categoriaId" value={product.categoriaId} onChange={handleProductChange} required>
                <option value="">Selecione...</option>
                {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
              </select>
            </div>
            <div className="form-group full-width">
              <label htmlFor="descricao">Descrição</label>
              <textarea id="descricao" name="descricao" value={product.descricao} onChange={handleProductChange} required />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Variações</h2>
          <button type="button" onClick={addCustomization} className="add-button">Adicionar Variação</button>
          {customizations.map((cust, index) => (
            <div key={index} className="customization-card">
              <div className="card-header">
                <h3>Variação #{index + 1}</h3>
                <button type="button" onClick={() => removeCustomization(index)} className="remove-button">Remover</button>
              </div>
              <div className="form-grid">
                
                <div className="form-group full-width">
                  <label>Tamanhos Disponíveis</label>
                  <div className="checkbox-group-container">
                    {TAMANHOS_OPCOES.map(tamanho => (
                      <label key={tamanho} className="checkbox-label">
                        <input 
                            type="checkbox" 
                            checked={cust.tamanhos.includes(tamanho)} 
                            onChange={() => handleCheckboxChange(index, 'tamanhos', tamanho)} 
                        />
                        {tamanho}
                      </label>
                    ))}
                  </div>
                </div>
                
                {Object.keys(cust.estoqueTamanhos).length > 0 && (
                    <div className="form-group full-width">
                        <EstoqueManager 
                            customId={index} 
                            stockMap={cust.estoqueTamanhos} 
                            onStockChange={(newMap) => handleStockChange(index, 'estoqueTamanhos', newMap)} 
                            isTamanho={true} 
                        />
                    </div>
                )}
                                
                <div className="form-group">
                  <label>Imagem da Variação</label>
                  <input type="file" name="imagem" accept="image/png, image/jpeg, image/webp" onChange={(e) => handleImageChange(index, e.target.files[0])} required />
                </div>
                
                <div className="image-preview with-suggestions">
                  {cust.preview && <img src={cust.preview} alt="Pré-visualização" />}
                  {cust.isAnalyzing && <div className="suggested-colors-loading">A analisar cores...</div>}
                  {cust.suggestedColors && cust.suggestedColors.length > 0 && (
                    <div className="suggested-colors-section">
                      <label>Cores Sugeridas (clique para adicionar)</label>
                      <div className="suggested-colors-palette">
                        {cust.suggestedColors.map((color, idx) => (
                          <div
                            key={idx}
                            className="suggested-color-swatch"
                            style={{ backgroundColor: color }}
                            title={`Adicionar ${color}`}
                            onClick={() => addColorToCustomization(index, color)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="form-group full-width">
                  <label>Cores Selecionadas</label>
                  <div className="color-input-area">
                    <div className="selected-colors">
                      {cust.cores.map(color => (
                        <div key={color} className="color-swatch-wrapper">
                          <span className="color-swatch" style={{ backgroundColor: color }}></span>
                          <span className="color-hex">{color}</span>
                          <button type="button" onClick={() => removeColorFromCustomization(index, color)} className="remove-color-btn">&times;</button>
                        </div>
                      ))}
                    </div>
                    <ColorPicker onColorSelect={(color) => addColorToCustomization(index, color)} />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {error && <p className="error-message">{error}</p>}
        
        <div className="form-actions">
          <button type="submit" className="save-button" disabled={isLoading}>
            {isLoading ? 'A guardar...' : 'Guardar Produto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;

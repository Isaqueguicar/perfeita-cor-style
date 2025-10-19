import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../components/auth/AuthContext';
import { createCategory, updateCategory, fetchCategoryDetails, getImageUrl } from '../../services/api';
import './CategoryForm.css';

const CategoryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useAuth();
  const isEditing = Boolean(id);

  const [nome, setNome] = useState('');
  const [imagem, setImagem] = useState(null);
  const [imagemPreview, setImagemPreview] = useState(null);
  const [existingImagePath, setExistingImagePath] = useState(null); // Guardar path original
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Efeito para buscar dados da categoria se estiver editando
  useEffect(() => {
    if (isEditing && token) {
      setIsLoading(true);
      console.log(`Buscando detalhes para Categoria ID: ${id}`); // DEBUG
      fetchCategoryDetails(id, token)
        .then(data => {
          console.log("Dados recebidos da API:", data); // DEBUG
          setNome(data.nome);
          
          // O nome do campo no DTO do backend é 'imagemPath'
          console.log("Path da imagem recebido:", data.imagemPath); // DEBUG
          if (data.imagemPath) {
            setExistingImagePath(data.imagemPath); // Guarda o path original
            const imageUrl = getImageUrl(data.imagemPath);
            console.log("URL da imagem gerada:", imageUrl); // DEBUG
            setImagemPreview(imageUrl);
          }
          setIsLoading(false);
        })
        .catch(err => {
          setError('Falha ao carregar dados da categoria para edição.');
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [isEditing, id, token]);

  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Tipo de arquivo inválido. Use JPG, PNG ou WEBP.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Arquivo muito grande. Máximo de 5MB.');
        return;
      }
      setError('');
      setImagem(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
        // Se o usuário cancelar a seleção, reverte para a imagem original (se estiver editando)
        setImagem(null);
        setImagemPreview(existingImagePath ? getImageUrl(existingImagePath) : null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nome) {
      setError('O nome da categoria é obrigatório.');
      return;
    }
    if (!isEditing && !imagem) {
      setError('A imagem da categoria é obrigatória.');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // O backend espera um @RequestPart "request" e um @RequestPart "imagem"
    // O FormData precisa ser construído com essas duas partes.
    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify({ nome })], { type: 'application/json' }));
    
    if (imagem) { // Envia a imagem apenas se uma nova foi selecionada
      formData.append('imagem', imagem);
    }

    try {
      if (isEditing) {
        await updateCategory(id, formData, token);
      } else {
        await createCategory(formData, token);
      }
      navigate('/admin/categorias');
    } catch (err) {
      setError(err.message || `Ocorreu um erro ao ${isEditing ? 'atualizar' : 'salvar'} a categoria.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing && isLoading && !nome) {
      return <div className="category-form-page"><h1>Carregando Categoria...</h1></div>
  }

  return (
    <div className="category-form-page">
      <div className="page-header">
         <h1>{isEditing ? `Editar Categoria #${id}` : 'Nova Categoria'}</h1>
         <button onClick={() => navigate('/admin/categorias')} className="back-button" disabled={isLoading}>
             Voltar
         </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="category-form">
        <div className="form-group">
          <label htmlFor="nome">Nome da Categoria</label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Ex: Roupas Casuais"
          />
        </div>

        <div className="form-group">
          <label htmlFor="imagem">Imagem da Categoria</label>
          <input
            type="file"
            id="imagem"
            accept="image/jpeg, image/png, image/webp"
            onChange={handleImagemChange}
            disabled={isLoading}
          />
          {isEditing && !imagem && <small>Selecione uma nova imagem para substituir a atual.</small>}
        </div>

        {imagemPreview && (
          <div className="image-preview-container">
            <p>Pré-visualização:</p>
            <img src={imagemPreview} alt="Preview da categoria" className="image-preview" />
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="save-button" disabled={isLoading}>
            {isLoading ? 'Salvando...' : (isEditing ? 'Atualizar Categoria' : 'Salvar Categoria')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;


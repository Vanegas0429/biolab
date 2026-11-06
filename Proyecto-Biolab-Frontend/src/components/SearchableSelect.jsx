import { useState, useEffect, useRef, useMemo } from 'react';

/**
 * Componente SearchableSelect
 * Selector accesible y moderno con barra de búsqueda integrada en tiempo real.
 * Soporta búsqueda insensible a mayúsculas y acentos/tildes.
 */
const normalizeText = (text) => {
  if (!text) return '';
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

const SearchableSelect = ({
  options = [],
  value = '',
  onChange,
  placeholder = 'Selecciona una opción',
  searchPlaceholder = 'Buscar...',
  disabled = false,
  required = false,
  id,
  name,
  className = '',
  emptyText = 'No se encontraron resultados'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Cerrar al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Foco automático en el input de búsqueda al abrir
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  // Encontrar la opción actualmente seleccionada
  const selectedOption = useMemo(() => {
    return options.find((opt) => String(opt.value) === String(value)) || null;
  }, [options, value]);

  // Filtrado de opciones
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    const query = normalizeText(search);
    return options.filter((opt) => {
      const matchLabel = normalizeText(opt.label).includes(query);
      const matchSub = opt.subLabel ? normalizeText(opt.subLabel).includes(query) : false;
      return matchLabel || matchSub;
    });
  }, [options, search]);

  const handleSelect = (val) => {
    if (disabled) return;
    onChange && onChange(val);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (disabled) return;
    onChange && onChange('');
  };

  return (
    <div
      ref={containerRef}
      className={`position-relative w-100 ${className}`}
      style={{ userSelect: 'none' }}
    >
      {/* Botón visual que simula el select */}
      <div
        className={`form-select rounded-pill shadow-sm d-flex align-items-center justify-content-between px-3 ${
          disabled ? 'bg-light text-muted' : 'bg-white'
        }`}
        style={{
          cursor: disabled ? 'not-allowed' : 'pointer',
          minHeight: '38px',
          borderColor: isOpen ? 'var(--primary-color, #10b981)' : '#ced4da',
          boxShadow: isOpen ? '0 0 0 0.25rem rgba(16, 185, 129, 0.25)' : undefined
        }}
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
      >
        <div className="text-truncate me-2" style={{ maxWidth: '85%' }}>
          {selectedOption ? (
            <span className="fw-semibold text-dark">
              {selectedOption.label}
              {selectedOption.subLabel && (
                <small className="text-muted ms-2 fw-normal">{selectedOption.subLabel}</small>
              )}
            </span>
          ) : (
            <span className="text-muted">{placeholder}</span>
          )}
        </div>

        <div className="d-flex align-items-center gap-2">
          {selectedOption && !disabled && (
            <span
              role="button"
              className="text-secondary hover-danger"
              style={{ fontSize: '0.85rem' }}
              onClick={handleClear}
              title="Limpiar selección"
            >
              <i className="fa-solid fa-xmark"></i>
            </span>
          )}
          <i
            className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'} text-muted`}
            style={{ fontSize: '0.75rem', transition: 'transform 0.2s' }}
          ></i>
        </div>
      </div>

      {/* Input oculto para validaciones nativas de formulario */}
      <input
        type="hidden"
        id={id}
        name={name}
        value={value ?? ''}
        required={required}
      />

      {/* Menú desplegable */}
      {isOpen && !disabled && (
        <div
          className="position-absolute start-0 w-100 bg-white border rounded-4 shadow-lg p-2"
          style={{
            top: 'calc(100% + 4px)',
            zIndex: 1060,
            maxHeight: '280px',
            minWidth: '220px'
          }}
        >
          {/* Campo de búsqueda */}
          <div className="input-group input-group-sm mb-2 shadow-sm">
            <span className="input-group-text bg-light border-end-0 rounded-start-pill text-muted px-3">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <input
              ref={searchInputRef}
              type="text"
              className="form-control bg-light border-start-0 rounded-end-pill px-2"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setIsOpen(false);
              }}
            />
            {search && (
              <button
                type="button"
                className="btn btn-sm btn-light border border-start-0 rounded-end-pill text-muted"
                onClick={() => setSearch('')}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>

          {/* Lista scrollable de opciones */}
          <div
            className="overflow-auto custom-scroll"
            style={{ maxHeight: '200px' }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <div
                    key={opt.value}
                    className={`d-flex align-items-center justify-content-between px-3 py-2 rounded-3 my-1 ${
                      isSelected
                        ? 'bg-success text-white fw-bold'
                        : 'text-dark hover-bg-light'
                    }`}
                    style={{
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'background-color 0.15s ease'
                    }}
                    onClick={() => handleSelect(opt.value)}
                  >
                    <div className="text-truncate">
                      <span>{opt.label}</span>
                      {opt.subLabel && (
                        <small
                          className={`ms-2 d-inline-block ${
                            isSelected ? 'text-white-50' : 'text-muted'
                          }`}
                        >
                          {opt.subLabel}
                        </small>
                      )}
                    </div>
                    {isSelected && (
                      <i className="fa-solid fa-check ms-2"></i>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center text-muted py-3 small">
                <i className="fa-solid fa-circle-exclamation me-1"></i>
                {emptyText}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;


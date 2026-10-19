import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../services/api'
import { useToast } from '../../context/toast'
import { Campo } from '../../components/Campo'
import { Cargando, ErrorCarga } from '../../components/Estados'
import { ETIQUETAS, FOTO_POR_DEFECTO } from '../../utils/formato'

// Fotos que ya existen en client/public/img/mascotas (atajo para elegir rápido)
const FOTOS_DISPONIBLES = ['paris.jpg', 'perro2.jpg', 'perro3.jpg', 'gato2.jpg'].map((f) => `/img/mascotas/${f}`)

const TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FOTO_MB = 5

const VACIA = {
  nombre: '', especie: 'perro', raza: '', edadValor: '', edadUnidad: 'anios',
  genero: 'macho', tamano: '', descripcion: '', foto_url: '', estado: 'disponible',
}

// La BD guarda la edad en meses; el formulario permite escribirla en años o meses
function aFormulario(m) {
  const meses = m.edad_meses
  const enAnios = meses !== null && meses >= 12 && meses % 12 === 0
  return {
    ...VACIA,
    ...Object.fromEntries(Object.entries(m).map(([k, v]) => [k, v ?? ''])),
    edadValor: meses === null ? '' : enAnios ? meses / 12 : meses,
    edadUnidad: enAnios ? 'anios' : 'meses',
  }
}

// Crear (/admin/mascotas/nueva) y editar (/admin/mascotas/:id): la C y la U del CRUD
export function AdminMascotaForm() {
  const { id } = useParams()
  const editando = Boolean(id)
  const navigate = useNavigate()
  const toast = useToast()

  const [form, setForm] = useState(VACIA)
  const [cargando, setCargando] = useState(editando)
  const [errorCarga, setErrorCarga] = useState(null)
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const inputFoto = useRef(null)

  useEffect(() => {
    if (!editando) return
    api
      .get(`/mascotas/${id}`)
      .then((m) => setForm(aFormulario(m)))
      .catch(setErrorCarga)
      .finally(() => setCargando(false))
  }, [editando, id])

  const cambiar = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrores({ ...errores, [e.target.name]: undefined })
  }

  // Sube la foto apenas se elige; el formulario guarda solo la URL que devuelve el servidor
  const elegirFoto = async (e) => {
    const archivo = e.target.files[0]
    e.target.value = '' // permite volver a elegir el mismo archivo
    if (!archivo) return
    if (!TIPOS_FOTO.includes(archivo.type)) {
      return setErrores({ ...errores, foto_url: 'Elige una imagen JPG, PNG o WEBP' })
    }
    if (archivo.size > MAX_FOTO_MB * 1024 * 1024) {
      return setErrores({ ...errores, foto_url: `La imagen supera ${MAX_FOTO_MB} MB` })
    }
    setSubiendo(true)
    setErrores({ ...errores, foto_url: undefined })
    try {
      const { url } = await api.subirFoto(archivo)
      setForm((f) => ({ ...f, foto_url: url }))
      toast.exito('Foto subida')
    } catch (err) {
      setErrores((errs) => ({ ...errs, foto_url: err.message }))
    } finally {
      setSubiendo(false)
    }
  }

  const enviar = async (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.nombre.trim()) errs.nombre = 'El nombre es obligatorio'
    const edad = form.edadValor === '' ? null : Number(form.edadValor)
    if (edad !== null && (!Number.isInteger(edad) || edad < 0)) errs.edadValor = 'Escribe un número entero'
    setErrores(errs)
    if (Object.keys(errs).length) return

    const datos = {
      nombre: form.nombre.trim(),
      especie: form.especie,
      raza: form.raza.trim() || null,
      edad_meses: edad === null ? null : form.edadUnidad === 'anios' ? edad * 12 : edad,
      genero: form.genero,
      tamano: form.tamano || null,
      descripcion: form.descripcion.trim() || null,
      foto_url: form.foto_url.trim() || null,
      estado: form.estado,
    }

    setErrorGeneral('')
    setGuardando(true)
    try {
      const guardada = editando ? await api.put(`/mascotas/${id}`, datos) : await api.post('/mascotas', datos)
      toast.exito(editando ? 'Cambios guardados' : `${guardada.nombre} fue agregada al catálogo`)
      navigate('/admin/mascotas')
    } catch (err) {
      setErrorGeneral(err.message)
      setGuardando(false)
    }
  }

  if (cargando) return <Cargando />
  if (errorCarga) return <ErrorCarga error={errorCarga} />

  return (
    <>
      <div className="admin__barra">
        <h2>{editando ? `Editar a ${form.nombre || 'mascota'}` : 'Nueva mascota'}</h2>
        <Link to="/admin/mascotas" className="btn btn--fantasma">← Volver</Link>
      </div>

      <form className="form-mascota" onSubmit={enviar} noValidate>
        <div className="tarjeta formulario">
          {errorGeneral && <div className="alerta alerta--error" role="alert">{errorGeneral}</div>}
          <div className="formulario__fila">
            <Campo id="nombre" name="nombre" label="Nombre" value={form.nombre} onChange={cambiar} error={errores.nombre} />
            <Campo id="raza" name="raza" label="Raza" opcional value={form.raza} onChange={cambiar} />
          </div>
          <div className="formulario__fila">
            <Campo id="especie" name="especie" label="Especie" como="select" value={form.especie} onChange={cambiar}>
              {Object.entries(ETIQUETAS.especie).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
            </Campo>
            <Campo id="genero" name="genero" label="Género" como="select" value={form.genero} onChange={cambiar}>
              {Object.entries(ETIQUETAS.genero).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
            </Campo>
            <Campo id="tamano" name="tamano" label="Tamaño" como="select" value={form.tamano} onChange={cambiar}>
              <option value="">Sin definir</option>
              {Object.entries(ETIQUETAS.tamano).map(([v, t]) => <option key={v} value={v}>{t}</option>)}
            </Campo>
          </div>
          <div className="formulario__fila">
            <Campo id="edadValor" name="edadValor" label="Edad" opcional type="number" min="0" value={form.edadValor} onChange={cambiar} error={errores.edadValor} />
            <Campo id="edadUnidad" name="edadUnidad" label="Unidad" como="select" value={form.edadUnidad} onChange={cambiar}>
              <option value="anios">Años</option>
              <option value="meses">Meses</option>
            </Campo>
            <Campo id="estado" name="estado" label="Estado" como="select" value={form.estado} onChange={cambiar}>
              {['disponible', 'en_proceso', 'adoptada'].map((v) => <option key={v} value={v}>{ETIQUETAS.estado[v]}</option>)}
            </Campo>
          </div>
          <div className="form-mascota__subir">
            <span className="form-mascota__subir-titulo">Foto</span>
            <input
              ref={inputFoto} type="file" accept={TIPOS_FOTO.join(',')} hidden
              onChange={elegirFoto} aria-label="Subir foto"
            />
            <button type="button" className="btn btn--secundario" onClick={() => inputFoto.current.click()} disabled={subiendo}>
              {subiendo ? 'Subiendo…' : '📷 Subir foto'}
            </button>
            <span className="campo__ayuda">JPG, PNG o WEBP · máximo {MAX_FOTO_MB} MB</span>
          </div>
          <Campo
            id="foto_url" name="foto_url" label="…o pega la URL de una imagen" opcional
            placeholder="/img/mascotas/... o https://..."
            value={form.foto_url} onChange={cambiar} error={errores.foto_url}
            ayuda="También puedes elegir una de las fotos de ejemplo:"
          />
          <div className="form-mascota__fotos">
            {FOTOS_DISPONIBLES.map((f) => (
              <button type="button" key={f} aria-pressed={form.foto_url === f} onClick={() => setForm({ ...form, foto_url: f })}>
                <img src={f} alt={`Usar ${f}`} />
              </button>
            ))}
          </div>
          <Campo
            id="descripcion" name="descripcion" label="Descripción" opcional como="textarea" maxLength={2000}
            placeholder="Personalidad, hábitos, qué tipo de hogar necesita…"
            value={form.descripcion} onChange={cambiar}
          />
          <div className="form-mascota__acciones">
            <button className="btn" disabled={guardando || subiendo}>{guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear mascota'}</button>
            <Link to="/admin/mascotas" className="btn btn--secundario">Cancelar</Link>
          </div>
        </div>

        <aside className="tarjeta form-mascota__preview">
          <p className="item__meta">Vista previa</p>
          <img
            src={form.foto_url || FOTO_POR_DEFECTO}
            alt="Vista previa de la foto"
            onError={(e) => (e.currentTarget.src = FOTO_POR_DEFECTO)}
          />
          <h3 style={{ marginTop: '0.75rem' }}>{form.nombre || 'Nombre'}</h3>
          <p className="item__meta">{form.raza || ETIQUETAS.especie[form.especie]}</p>
        </aside>
      </form>
    </>
  )
}

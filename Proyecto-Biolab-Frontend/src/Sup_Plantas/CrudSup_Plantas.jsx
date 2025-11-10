import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"

const CrudSup_Plantas = () => {

  // Crear una prop para guardar los datos de la consulta
  const [Sup_Plantas, setSup_Plantas] = useState([])

  // El useEffect se ejecuta cuando se carga el componente
  useEffect(() => {
    
    getAllSup_Plantas()
  }, [])

  // Crear una función para la consulta
  const getAllSup_Plantas = async () => {
    const response = await apiAxios.get('/api/Sup_Planta') // Se utilizará el apiAxios que tiene la URL del backend
    setSup_Plantas(response.data) // Se llena la constante players con el resultado de la consulta
    console.log(response.data) // Imprimir en consola el resultado de la consulta
  }

  return (
    <>
      <h1>Hello World</h1>
    </>
  )
}

export default CrudSup_Plantas
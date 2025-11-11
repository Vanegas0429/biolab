import { useState, useEffect } from "react"
import apiAxios from "../api/axiosConfig.js"
import DataTable from 'react-data-table-component'

const CrudCronograma = () => {

  // Crear una prop para guardar los datos de la consulta
  const [Cronogramas, setCronogramas] = useState([])
  const [filterText, setFilterText] = useState("")

  const columnsTable = [ //crear un arregli con las columnas que contendra la tabla
    {name: 'Funcionario', selector: row => row.Id_Funcionario},
    {name: 'Ficha', selector: row => row.Ficha},
    {name: 'Cantidad de Aprendices', selector: row => row.Can_Aprendices},
    {name: 'Actividad  Realizada', selector: row => row.Act_Realizada},
    {name: 'Equipo', selector: row => row.id_equipo},
]

  // El useEffect se ejecuta cuando se carga el componente
  useEffect(() => {
    
    getAllCronogramas()
  }, [])

  // Crear una función para la consulta
  const getAllCronogramas = async () => {
    const response = await apiAxios.get('/api/Cronograma') // Se utilizará el apiAxios que tiene la URL del backend
    setCronogramas(response.data) // Se llena la constante players con el resultado de la consulta
    console.log(response.data) // Imprimir en consola el resultado de la consulta
  }

  //Buscador
  // Buscador por hora (inicio o fin)
  const newListCronogramas = Cronogramas.filter((uso) => {
    const textToSearch = filterText.toLowerCase()

    const funcionario = Cronogramas.funcionarios.toLowerCase()
    const ficha = Cronogramas.fichas.toLowerCase()
    return (
      funcionario.includes(textToSearch) ||
      ficha.includes(textToSearch) 
    )

  })

  return (
    <>
    <div className="container mt-5">
        <div className="col-4">
            <input className="form-control" value={filterText} onChange={(e) => setFilterText(e.target.value)}/>

        </div>
        <DataTable
            title="Cronogramas" //Titulo de la tabla
            columns={columnsTable} //Columns de la tabla
            data={newListCronogramas} //Fuente de los datos
            keyField="id" //Identficador de cada registro
            pagination //Activar paginacion
            highlightOnHover //Resalta la fila por donde pase el mouse
            striped //Estilo de tabla - tono en filas intercaladas
        />
      </div>
    </>
  )
}

export default CrudCronograma
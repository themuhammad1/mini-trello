import './App.css'

import { Column } from './components/Column'
import { useApp } from './providers/AppProvider'

function App() {
  const {columns, db, setColumns } = useApp()
  
  async function addNewColumn() {
    const columnName = prompt("Enter Column Name")

    if (!columnName) { return }

    const columnsStore = db.transaction('columns', 'readwrite').objectStore('columns')
    const newColumn = {
      name: columnName,
      tasks: []
    }

    await columnsStore.add(newColumn)

    const columns = await columnsStore.getAll()
    setColumns(columns)
  }

  return (
    <main className="h-screen p-8 bg-gray-50">
      <div>
        <button onClick={addNewColumn} className="bg-sky-600 rounded p-2 text-white">New Column</button>
      </div>
      <div className="my-4">
        <ol className="flex list-none gap-4 overflow-x-auto">
          {columns.map((column) => (
            <Column key={column.id} column={column} />
          ))}
        </ol>
      </div>
    </main>

  )
}

export default App

import { createContext, useEffect, useContext, useState } from "react";
import { openDB } from 'idb'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [db, setDb] = useState()
  const [columns, setColumns] = useState([])
  
  const value = {db, columns, setColumns}
  
  useEffect(() => {
    async function init() {
      const db = await openDB('TasksTracker', 1, {
        upgrade(db) {

          if (!db.objectStoreNames.contains('columns')) {
            db.createObjectStore('columns', { keyPath: 'id', autoIncrement: true })
          }
        },
      })

      const columnsStore = db.transaction('columns', 'readonly').objectStore('columns')
      const columns = await columnsStore.getAll()
      
      setColumns(columns)
      setDb(db)

      console.log('DB connected and initialized')
    }

    init()
  }, [])
  
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  
  if (!context) {
    return new Error('You need to wrap context in a provider')
  }
  
  return context
}

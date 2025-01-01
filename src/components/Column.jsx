import { useState } from 'react'
import { useDrop } from 'react-dnd'
import { InlineEdit } from './InlineEdit'
import { NewCardInput } from './NewCardInput'
import { TaskCard } from './TaskCard'
import { Modal } from './Modal'
import { DeleteIcon } from './DeleteIcon'
import { useApp } from '../providers/AppProvider'

export function Column({ column }) {
  const {db, setColumns} = useApp()
  
  const [collectedProps, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: async (item) => {
      const sourceColumnId = item.columnId
      const destinationColumnId = column.id
      
      const columnStore = db.transaction('columns', "readwrite").objectStore('columns')
      const sourceColumn = await columnStore.get(sourceColumnId)
      const destinationColumn = await columnStore.get(destinationColumnId)
      
      sourceColumn.tasks = sourceColumn.tasks.filter(task => task.id !== item.task.id)
      
      await columnStore.put(sourceColumn)
      
      destinationColumn.tasks.unshift(item.task)
      
      await columnStore.put(destinationColumn)
      
      const columns = await columnStore.getAll()
      
      setColumns(columns)
    },
    canDrop: (item) => {
      const sourceColumnId = item.columnId
      const destinationColumnId = column.id
      
      if (sourceColumnId === destinationColumnId) { return false }
      
      return true
    },
    collect: (monitor) => ({
      isActive: monitor.canDrop() && monitor.isOver()
    })
    
  }))
  const [isAddingNewTask, setIsAddingNewTask] = useState(false)
  const [open, setOpen] = useState(false)
  const [taskBeingEdited, setTaskBeingEdited] = useState(null)
  
  const isDropping = collectedProps.isActive

  async function handleDelete() {
    const choice = confirm(`Are you sure, you want to delete column "${column.name}"?`)

    if (!choice) { return }
    
    const columnsStore = db.transaction('columns', 'readwrite').objectStore('columns')

    await columnsStore.delete(column.id)
    const columns = await columnsStore.getAll()
    setColumns(columns)
  }
  
  async function handleSave(title) {    
    if (!title) { return }

    const newTask = {
      id: crypto.randomUUID(),
      title,
      description: '',
      notes: []
    }

    const columnStore = db.transaction('columns', "readwrite").objectStore('columns')
    const col = await columnStore.get(column.id)

    col.tasks.push(newTask)

    await columnStore.put(col)

    const columns = await columnStore.getAll()

    setColumns(columns)
  }
  
  async function saveColumnName(id, newName) {
    const columnsStore = db.transaction('columns', 'readwrite').objectStore('columns')
    const column = await columnsStore.get(id)

    column.name = newName

    await columnsStore.put(column)
    const columns = await columnsStore.getAll()
    setColumns(columns)
  }
  
  function showModal(task) {
    setOpen(true)
    setTaskBeingEdited(task)
  }
  function hideModal() {
    setTaskBeingEdited(null)
    setOpen(false)
  }

  return (
    <li ref={drop} className="flex-none self-start w-80 rounded-lg bg-gray-200 p-4 shadow-sm">
      <Modal task={taskBeingEdited} columnId={column.id} isOpen={open} onClose={hideModal} />
      <div className="flex justify-between">

        <InlineEdit value={column.name} onSave={(newTitle) => saveColumnName(column.id, newTitle)} />
        <div className="cursor-pointer" onClick={handleDelete}>
          <DeleteIcon />
        </div>
      </div>

      <ol className="space-y-4 overflow-y-auto max-h-[calc(100vh-225px)]">
        {isDropping && <DropPreview />}
        {column.tasks.map((task) => (
          <TaskCard key={task.id} task={task} columnId={column.id} onClick={() => showModal(task)} />
        ))}
        {isAddingNewTask && (
          <li>
            <NewCardInput onSave={handleSave} onCancel={() => setIsAddingNewTask(false)} />
          </li>
        )}
      </ol>
      
      
      {!isAddingNewTask && <Button text="Add a card" onClick={() => setIsAddingNewTask(true)} /> }

    </li>
  )
}

function DropPreview() {
  return (
    <li className="bg-gray-300 rounded-lg shadow min-h-14">
    </li>
  )
}

function Button({ text, onClick }) {

  return (
    <div role="button" onClick={onClick} className="flex hover:bg-gray-300 rounded px-1 py-2 mt-2">
      <PlusIcon />
      <span className="ml-4">{text}</span>
    </div>
  )
}
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24">
      <path
        d="M12 4v16M4 12h16"
        stroke="#808080"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}


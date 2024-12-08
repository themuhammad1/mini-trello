import { useEffect, useState } from "react";
import { useApp } from "../providers/AppProvider";

export function Modal({ isOpen, onClose, task, columnId }) {  
  const { db, setColumns } = useApp()
  
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => {
        document.removeEventListener('keydown', handleEscKey);
      };
    }
  }, [isOpen, onClose]);
  
  async function handleTaskUpdate(e) {
    e.preventDefault()
    
    const title = e.target.title.value
    const description = e.target.description.value
    
    const columnStore = db.transaction('columns', "readwrite").objectStore('columns')
    const column = await columnStore.get(columnId)
    
    column.tasks = column.tasks.map(t => {
      if (t.id === task.id) {
        return {...t, title, description }
      } else {
        return t
      }
    })
    
    columnStore.put(column)
    
    const columns = await columnStore.getAll()

    setColumns(columns)
    
    onClose()
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleTaskUpdate}
        className="bg-white rounded-lg shadow-xl w-full max-w-xl mx-4"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Update Task</h2>
          <button
            type="button" 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            X
          </button>
        </div>

        <div className="p-4 space-y-4 h-[calc(80vh-100px)] overflow-y-auto">
          <input 
            type="text" 
            defaultValue={task.title}
            name="title"
            placeholder="Card Title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea 
            defaultValue={task.description}
            name="description"
            placeholder="Add a description..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md h-32 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="p-4 border-t flex justify-end space-x-2">
          <button
            type="button" 
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

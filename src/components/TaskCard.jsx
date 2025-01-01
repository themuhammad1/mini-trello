import { useDrag } from 'react-dnd'

export function TaskCard({ task, columnId, onClick }) {
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: 'CARD',
    item: { task, columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }))
  
  return (
    <li ref={drag} style={{ opacity: isDragging ? 0.5 : 1}} className={`bg-white p-4 rounded-lg shadow hover:cursor-pointer`} onClick={onClick}>
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-gray-600">{task.description}</p>
    </li>
    
  )
}

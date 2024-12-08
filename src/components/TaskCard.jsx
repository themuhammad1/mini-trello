export function TaskCard({ task, onClick }) {
  return (
    <li className="bg-white p-4 rounded-lg shadow hover:cursor-pointer" onClick={onClick}>
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-gray-600">{task.description}</p>
    </li>
  )
}

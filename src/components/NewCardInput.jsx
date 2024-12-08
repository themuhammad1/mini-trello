import { useRef } from "react"

export function NewCardInput({ onCancel, onSave }) {
  const lastEl = useRef()

  function handleSubmit(e) {
    e.preventDefault()
    const title = e.target.title.value

    onSave(title)
    
    setTimeout(() => {
      lastEl.current.scrollIntoView({behaviour: "smooth"})
            
    }, 5)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()

      e.target.parentElement.requestSubmit()
      e.target.value = ''
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onCancel()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea onKeyDown={handleKeyDown} autoFocus name="title" className="min-h-14 shadow-md resize-none w-full rounded-md px-2 py-1" placeholder='Enter a title or paste a link' />
      <div className="mt-1" ref={lastEl}>
        <button type="submit" className="bg-blue-700 text-white rounded px-4 py-1">Add Card</button>
        <button onClick={onCancel} className="hover:bg-gray-300 px-3 py-1 ml-1">X</button>
      </div>
    </form>
  )
}

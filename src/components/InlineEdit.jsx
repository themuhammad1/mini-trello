import { useState } from 'react'

export function InlineEdit({ value, onSave }) {
  const [isEditing, setIsEditing] = useState(false)

  function hideInput() {
    setIsEditing(false)
  }

  function handleSubmit(e) {
    e.preventDefault()

    const newTitle = e.target.title.value

    if (value === newTitle) {
      hideInput()
      return
    }

    onSave(newTitle)
    hideInput()
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault()
      submitForm(e)
    }
  }

  function selectText(e) {
    e.target.select()
  }

  function submitForm(e) {
    e.target.parentElement.requestSubmit()
  }

  if (isEditing) {
    return (
      <form onKeyDown={handleKeyDown} onSubmit={handleSubmit}>
        <input 
          className="font-bold text-md py-1 px-2 mb-2 rounded-md"
          onFocus={selectText}
          onBlur={submitForm} 
          autoFocus
          type="text" 
          name="title" 
          defaultValue={value} 
        />
        <input type="submit" hidden />
      </form>
    )
  }
  return (
    <h2 onClick={() => setIsEditing(true)} className="flex-1 font-bold mb-4">{value}</h2>
  )
}

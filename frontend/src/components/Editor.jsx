import { useRef, useState, useEffect } from 'react'
import Toolbar from './Toolbar'
import Button from './Button/Button'
import { RiSaveLine, RiDeleteBinLine } from '@remixicon/react'

export default function Editor({ initialContent = '', onSave }) {
  const editorRef = useRef(null)
  const [content, setContent] = useState(initialContent)
  const [isEditing, setIsEditing] = useState(false)

  // Load initial content
  useEffect(() => {
    if (editorRef.current && initialContent) {
      editorRef.current.innerHTML = initialContent
    }
  }, [initialContent])

  const handleInput = () => {
    setContent(editorRef.current.innerHTML)
    setIsEditing(true)
  }

  const handleSave = () => {
    if (onSave && content) {
      onSave(content)
      setIsEditing(false)
    }
  }

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = ''
      setContent('')
      setIsEditing(true)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow flex flex-col">
      <div className="p-2 border-b">
        <h2 className="font-semibold text-netural-charcol-grey">Editor</h2>
      </div>
      
      <Toolbar editor={editorRef.current} />
      
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="flex-1 min-h-[200px] p-4 focus:outline-none focus:ring-2 focus:ring-primary-tint2"
        style={{ textAlign: 'left' }}
        data-placeholder="Start typing here..."
      ></div>
      
      {/* Buttons container at the bottom */}
      <div className="flex flex-col sm:flex-row gap-2 p-4 border-t bg-gray-50 rounded-b-lg">
        <Button
          size="medium"
          variant="secondary"
          leftIcon="RiDeleteBinLine"
          label="Clear"
          onClick={handleClear}
          className="w-full sm:w-auto"
          fullWidth
        />
        <Button
          size="medium"
          variant={isEditing ? "primary" : "secondary"}
          leftIcon="RiSaveLine"
          label="Save"
          onClick={handleSave}
          disabled={!isEditing}
          className="w-full sm:w-auto"
          fullWidth
        />
      </div>
    </div>
  )
}
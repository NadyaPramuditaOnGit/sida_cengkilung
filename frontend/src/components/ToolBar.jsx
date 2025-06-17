import Button from './Button/Button'

export default function Toolbar({ editor }) {
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value)
    editor?.focus()
  }

  const createLink = () => {
    const url = prompt('Enter URL:', 'https://')
    if (url) {
      execCommand('createLink', url)
    }
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-white border border-gray-300">
      {/* Text formatting */}
      <Button 
        onClick={() => execCommand('bold')}
        variant="primary"
        size="small"
        leftIcon="RiBold"
        className="!w-auto !px-1 !min-w-0 !h-8"
        title="Bold"
      />
      <Button 
        onClick={() => execCommand('italic')}
        variant="primary"
        size="small"
        leftIcon="RiItalic"
        className="!w-auto !px-1 !min-w-0 !h-8"
        title="Italic"
      />
      <Button 
        onClick={() => execCommand('underline')}
        variant="primary"
        size="small"
        leftIcon="RiUnderline"
        className="!w-auto !px-1 !min-w-0 !h-8"
        title="Underline"
      />
      <Button 
        onClick={() => execCommand('strikeThrough')}
        variant="primary"
        size="small"
        leftIcon="RiStrikethrough"
        className="!w-auto !px-1 !min-w-0 !h-8"
        title="Strikethrough"
      />
      <Button 
        onClick={() => execCommand('removeFormat')}
        variant="primary"
        size="small"
        leftIcon="RiFormatClear"
        className="!w-auto !px-1 !min-w-0 !h-8"
        title="Clear Formatting"
      />
      
      <div className="border-l border-gray-300 mx-1 h-6 self-center"></div>
      
      {/* Links */}
      <Button 
        onClick={createLink}
        variant="primary"
        size="small"
        leftIcon="RiLink"
        className="!w-auto !px-1 !min-w-0 !h-8"
        title="Insert Link"
      />
      <Button 
        onClick={() => execCommand('unlink')}
        variant="primary"
        size="small"
        leftIcon="RiLinkUnlink"
        className="!w-auto !px-1 !min-w-0 !h-8"
        title="Remove Link"
      />
      
      <div className="border-l border-gray-300 mx-1 h-6 self-center"></div>
      
      {/* Alignment */}
      <Button 
        onClick={() => execCommand('justifyLeft')}
        variant="primary"
        size="small"
        leftIcon="RiAlignLeft"
        className="!w-auto !px-1 !min-w-0 !h-8"
        title="Align Left"
      />
      <Button 
        onClick={() => execCommand('justifyCenter')}
        variant="primary"
        size="small"
        leftIcon="RiAlignCenter"
        className="!w-auto !px-1 !min-w-0 !h-8"
        title="Align Center"
      />
      <Button 
        onClick={() => execCommand('justifyRight')}
        variant="primary"
        size="small"
        leftIcon="RiAlignRight"
        className="!w-auto !px-1 !min-w-0 !h-8"
        title="Align Right"
      />
      <Button 
        onClick={() => execCommand('justifyFull')}
        variant="primary"
        size="small"
        leftIcon="RiAlignJustify"
        className="!w-auto !px-1 !min-w-0 !h-8"
        title="Justify"
      />
      
      <div className="border-l border-gray-300 mx-1 h-6 self-center"></div>
      
      {/* Lists */}
      <Button 
        onClick={() => execCommand('insertUnorderedList')}
        variant="primary"
        size="small"
        leftIcon="RiListUnordered"
        className="!w-auto !px-1 !min-w-0 !h-8"
        title="Bullet List"
      />
      <Button 
        onClick={() => execCommand('insertOrderedList')}
        variant="primary"
        size="small"
        leftIcon="RiListOrdered"
        className="!w-auto !px-1 !min-w-0 !h-8"
        title="Numbered List"
      />
      
      <div className="border-l border-gray-300 mx-1 h-6 self-center"></div>
      
      {/* Font size */}
      <div className="relative">
      <select 
        onChange={(e) => execCommand('fontSize', e.target.value)}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        title="Font Size"
      >
        <option value="">Size</option>
        <option value="1">Small</option>
        <option value="3">Normal</option>
        <option value="5">Large</option>
        <option value="7">Huge</option>
      </select>
      <Button
        variant="primary"
        size="small"
        leftIcon="RiText"
        className="!w-auto !px-1 !min-w-0 !h-8 !justify-center"
        iconClassName="!m-0" 
        label="" 
      />
    </div>
    </div>
  )
}
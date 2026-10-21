import { useState } from "react"
import useDrive from "../../hooks/useDrive"
import { Modal } from "../ui/Modal"
import { Input } from "../ui/Input"
import { Button } from "../ui/Button"

const CreateFolderModal = () => {

  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { createFolder } = useDrive()

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="NewFolder" onSubmit={handleSubmit}>
      <form className="space-y-4">
        <Input
          label="Folder Name"
          placeholder="Untitled Folder"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autofocus
          required
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            variant="ghost"
            onClick={onClose}
            type="button"
          >
            Cancel
          </Button>

          <Button
            variant="primary"
            type="submit"
            disabled={!name.trim()}
            isLoading={isLoading}
          >
            Create
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateFolderModal
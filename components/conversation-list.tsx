"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Input } from "./ui/input"
import {
  Plus,
  MessageSquare,
  Trash2,
  Folder,
  FolderPlus,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  FolderOpen,
  Edit2,
  Search,
  X,
} from "lucide-react"
import type { Conversation, Folder as FolderType } from "./chat-interface"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"

interface ConversationListProps {
  conversations: Conversation[]
  folders: FolderType[]
  activeConversationId: string | null
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  onDeleteConversation: (id: string) => void
  onCreateFolder: (name: string) => void
  onDeleteFolder: (id: string) => void
  onRenameFolder: (id: string, newName: string) => void
  onMoveToFolder: (conversationId: string, folderId: string | null) => void
}

export function ConversationList({
  conversations,
  folders,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
  onMoveToFolder,
}: ConversationListProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null)
  const [renameFolderName, setRenameFolderName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsSearching(true)
      }
      if (e.key === "Escape" && isSearching) {
        setIsSearching(false)
        setSearchQuery("")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isSearching])

  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString()
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim())
      setNewFolderName("")
      setNewFolderDialogOpen(false)
    }
  }

  const handleRenameFolder = (folderId: string) => {
    if (renameFolderName.trim()) {
      onRenameFolder(folderId, renameFolderName.trim())
      setRenamingFolderId(null)
      setRenameFolderName("")
    }
  }

  const filteredConversations = searchQuery
    ? conversations.filter(
        (conv) =>
          conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.messages.some((msg) => msg.content.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : conversations

  const unorganizedConversations = filteredConversations.filter((c) => !c.folderId)

  const ConversationItem = ({ conversation }: { conversation: Conversation }) => (
    <div
      key={conversation.id}
      className={`group relative rounded-lg transition-colors ${
        activeConversationId === conversation.id ? "bg-muted" : "hover:bg-muted/50"
      }`}
    >
      <button onClick={() => onSelectConversation(conversation.id)} className="w-full text-left px-3 py-2 pr-10">
        <div className="font-medium text-sm truncate mb-1">{conversation.title}</div>
        <div className="text-xs text-muted-foreground">{formatDate(conversation.updatedAt)}</div>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Folder className="h-4 w-4 mr-2" />
              Move to folder
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => onMoveToFolder(conversation.id, null)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                No folder
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {folders.map((folder) => (
                <DropdownMenuItem key={folder.id} onClick={() => onMoveToFolder(conversation.id, folder.id)}>
                  <Folder className="h-4 w-4 mr-2" />
                  {folder.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete this conversation and all its messages. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDeleteConversation(conversation.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex gap-2">
        <Button onClick={onNewConversation} className="flex-1 justify-start gap-2">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
        <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <FolderPlus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new folder</DialogTitle>
              <DialogDescription>Enter a name for your new folder</DialogDescription>
            </DialogHeader>
            <Input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewFolderDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateFolder}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearching(true)}
          placeholder="Search conversations..."
          className="pl-9 pr-20"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => {
                setSearchQuery("")
                setIsSearching(false)
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {searchQuery && (
        <div className="text-xs text-muted-foreground px-2">
          {filteredConversations.length} result{filteredConversations.length !== 1 ? "s" : ""}
        </div>
      )}

      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="space-y-1">
          {searchQuery ? (
            <>
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <ConversationItem key={conversation.id} conversation={conversation} />
                ))
              ) : (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No conversations found</p>
                </div>
              )}
            </>
          ) : (
            <>
              {folders.map((folder) => {
                const folderConversations = filteredConversations.filter((c) => c.folderId === folder.id)
                const isExpanded = expandedFolders.has(folder.id)

                return (
                  <div key={folder.id} className="space-y-1">
                    <div className="group flex items-center gap-1 px-2 py-1.5 rounded-lg hover:bg-muted/50">
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => toggleFolder(folder.id)}>
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      {isExpanded ? (
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Folder className="h-4 w-4 text-muted-foreground" />
                      )}
                      {renamingFolderId === folder.id ? (
                        <Input
                          value={renameFolderName}
                          onChange={(e) => setRenameFolderName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleRenameFolder(folder.id)
                            if (e.key === "Escape") setRenamingFolderId(null)
                          }}
                          onBlur={() => handleRenameFolder(folder.id)}
                          className="h-6 text-sm flex-1"
                          autoFocus
                        />
                      ) : (
                        <span className="text-sm font-medium flex-1">{folder.name}</span>
                      )}
                      <span className="text-xs text-muted-foreground">{folderConversations.length}</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setRenamingFolderId(folder.id)
                              setRenameFolderName(folder.name)
                            }}
                          >
                            <Edit2 className="h-4 w-4 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete folder?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will delete the folder. Conversations inside will be moved to the main list.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDeleteFolder(folder.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {isExpanded && (
                      <div className="ml-6 space-y-1">
                        {folderConversations.map((conversation) => (
                          <ConversationItem key={conversation.id} conversation={conversation} />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

              {unorganizedConversations.length > 0 && (
                <>
                  {folders.length > 0 && <div className="h-2" />}
                  {unorganizedConversations.map((conversation) => (
                    <ConversationItem key={conversation.id} conversation={conversation} />
                  ))}
                </>
              )}

              {conversations.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No conversations yet</p>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

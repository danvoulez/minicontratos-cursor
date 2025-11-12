"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Avatar, AvatarFallback } from "./ui/avatar"
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
  Settings,
  Workflow,
  Users,
  History,
  FileText,
  TrendingUp,
  BarChart3,
  MessageCircle,
  ShoppingCart,
  UserCircle,
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
import { Separator } from "./ui/separator"
import { SettingsDialog } from "./settings-dialog"

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
  userName?: string
  userRole?: string
  onFlowClick?: (flowName: string) => void
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
  userName = "User",
  userRole = "Member",
  onFlowClick,
}: ConversationListProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null)
  const [renameFolderName, setRenameFolderName] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["chatHistory"]))
  const [settingsOpen, setSettingsOpen] = useState(false)

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

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }

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

  const mockMyFlows = [
    { id: "1", name: "Contract Review", icon: FileText, color: "text-blue-500", count: 12 },
    { id: "2", name: "Email Drafts", icon: MessageCircle, color: "text-purple-500", count: 8 },
    { id: "3", name: "Data Analysis", icon: BarChart3, color: "text-emerald-500", count: 5 },
  ]

  const mockCircleFlows = [
    { id: "4", name: "Sales Pipeline", icon: TrendingUp, color: "text-orange-500", count: 24 },
    { id: "5", name: "Customer Support", icon: UserCircle, color: "text-cyan-500", count: 18 },
    { id: "6", name: "Order Processing", icon: ShoppingCart, color: "text-rose-500", count: 31 },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 flex items-center gap-3">
        <Avatar className="h-12 w-12 ring-2 ring-primary/20">
          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold text-base">
            {getUserInitials(userName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="font-semibold text-sm">{userName}</div>
          <div className="text-xs text-muted-foreground">{userRole}</div>
        </div>
      </div>

      <Separator className="mb-3" />

      <div className="px-4 pb-3 space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearching(true)}
              placeholder="Search..."
              className="pl-9 pr-16 h-9 bg-muted/50"
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
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-background/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>

          <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9 bg-muted/30 hover:bg-muted/50">
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
                <Button onClick={handleCreateFolder} className="bg-emerald-600 hover:bg-emerald-700">
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Button
          onClick={onNewConversation}
          className="w-full justify-center gap-2 h-10 bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      <Separator className="mb-2" />

      <div className="flex-1 overflow-y-auto px-2">
        <div className="space-y-1 pb-2">
          <div>
            <button
              onClick={() => toggleSection("myFlows")}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Workflow className="h-4 w-4 text-emerald-500" />
                <span className="text-sm font-semibold">My Flows</span>
              </div>
              {expandedSections.has("myFlows") ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {expandedSections.has("myFlows") && (
              <div className="ml-2 mt-1 mb-3 space-y-1">
                {mockMyFlows.map((flow) => {
                  const Icon = flow.icon
                  return (
                    <button
                      key={flow.id}
                      onClick={() => onFlowClick?.(flow.name)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className={`p-2 rounded-lg bg-muted/50 ${flow.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium">{flow.name}</div>
                        <div className="text-xs text-muted-foreground">{flow.count} items</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => toggleSection("circleFlows")}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Users className="h-4 w-4 text-cyan-500" />
                <span className="text-sm font-semibold">Circle Flows</span>
              </div>
              {expandedSections.has("circleFlows") ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {expandedSections.has("circleFlows") && (
              <div className="ml-2 mt-1 mb-3 space-y-1">
                {mockCircleFlows.map((flow) => {
                  const Icon = flow.icon
                  return (
                    <button
                      key={flow.id}
                      onClick={() => onFlowClick?.(flow.name)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
                    >
                      <div className={`p-2 rounded-lg bg-muted/50 ${flow.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium">{flow.name}</div>
                        <div className="text-xs text-muted-foreground">{flow.count} items</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Chat History Section */}
          <div>
            <button
              onClick={() => toggleSection("chatHistory")}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <History className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Chat History</span>
              </div>
              {expandedSections.has("chatHistory") ? (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {expandedSections.has("chatHistory") && (
              <div className="ml-2 mt-1 mb-2 space-y-2">
                {searchQuery && (
                  <div className="text-xs text-muted-foreground px-4">
                    {filteredConversations.length} result{filteredConversations.length !== 1 ? "s" : ""}
                  </div>
                )}

                <div className="space-y-1 px-2">
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
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => toggleFolder(folder.id)}
                              >
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
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                                  >
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
                                          This will delete the folder. Conversations inside will be moved to the main
                                          list.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => onDeleteFolder(folder.id)}>
                                          Delete
                                        </AlertDialogAction>
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
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 border-t mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2.5 h-10 hover:bg-muted/50"
          onClick={() => setSettingsOpen(true)}
        >
          <Settings className="h-4 w-4" />
          <span className="text-sm font-medium">Settings</span>
        </Button>
        <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      </div>
    </div>
  )
}

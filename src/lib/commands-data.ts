import commandsJson from '@/data/commands.json'

export interface Command {
  id: string
  name: string
  command: string
  category: string
}

export interface CommandCategory {
  id: string
  nameZh: string
  nameEn: string
}

export const categories: CommandCategory[] = commandsJson.categories
export const commands: Command[] = commandsJson.commands

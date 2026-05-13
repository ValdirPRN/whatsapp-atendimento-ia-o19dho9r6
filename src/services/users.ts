import pb from '@/lib/pocketbase/client'

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  created: string
  updated: string
}

export const getUsers = () => pb.collection('users').getFullList<User>({ sort: '-created' })
export const createUser = (data: any) => pb.collection('users').create<User>(data)
export const deleteUser = (id: string) => pb.collection('users').delete(id)

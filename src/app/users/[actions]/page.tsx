'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Check, Cross, X } from 'lucide-react'
import { DataTable } from '@/components/DataTable'
type User = {
    id: string
    name: string
    phone?: string
    password: string
    status: 'ACTIVE' | 'INACTIVE'
    balance?: number
}

const UsersPage = () => {
    const { actions } = useParams()
    const [allUsers, setAllUsers] = useState<User[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(false)
    const [addLoading, setAddLoading] = useState(false)
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

    const router = useRouter()

    const [newUser, setNewUser] = useState<Omit<User, 'id' | 'status'>>({
        name: '',
        phone: '',
        password: '',
        balance: 0,
    })

    const getAllUsers = async () => {
        setLoading(true)
        try {
            const res = await axios.get('/api/admin/getAllUsers')
            setAllUsers(res.data)
        } catch (error) {
            toast.error('Failed to fetch users')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllUsers()
    }, [])

    const updateUserStatus = async (id: string, status: 'ACTIVE' | 'INACTIVE') => {
        setUpdatingUserId(id)
        try {
            const res = await axios.post('/api/admin/updateUserStatus', { id, status })
            if (res.status === 200) {
                setAllUsers(prev =>
                    prev.map(user => (user.id === id ? { ...user, status } : user))
                )
                toast.success(`User status updated to ${status}`)
            }
        } catch (error) {
            toast.error('Failed to update status')
        } finally {
            setUpdatingUserId(null)
        }
    }

    const handleAddUser = async () => {
        setAddLoading(true)
        try {
            const res = await axios.post('/api/admin/addUser', newUser)
            if (res.status === 200) {
                toast.success('User added successfully')
                setNewUser({ name: '', phone: '', password: '', balance: 0 })
                getAllUsers()
            }
        } catch (error) {
            toast.error('Failed to add user')
        } finally {
            setAddLoading(false)
        }
    }

    const filteredUsers = allUsers.filter(user =>
        `${user.name} ${user.phone}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const statusFilter =
        actions === 'active' ? 'ACTIVE' : actions === 'inactive' ? 'INACTIVE' : 'ALL'

    const visibleUsers = statusFilter === 'ALL'
        ? filteredUsers
        : filteredUsers.filter(user => user.status === statusFilter)

    const columns = [
        {
            header: 'Name',
            accessor: (row: User) => (
                <button
                    onClick={() => router.push(`/users/bids?id=${row.id}`)}
                    className="text-blue-600 hover:underline"
                >
                    {row.name}
                </button>
            ),
        },
        { header: 'Phone', accessor: 'phone' },
        { header: 'Password', accessor: 'password' },
        {
            header: 'Status', accessor: (row: User) => (
                <span className={`font-semibold ${row.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}>
                    {row.status}
                </span>
            )
        },
        {
            header: 'Actions',
            accessor: (row: User) => (
                <button
                    onClick={() => updateUserStatus(row.id, row.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE')}
                    disabled={updatingUserId === row.id}
                    className={`flex items-center gap-2 text-white text-xs px-3 py-1 rounded 
                ${row.status === 'ACTIVE' ? 'bg-red-600' : 'bg-green-600'} 
                ${updatingUserId === row.id ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                    {updatingUserId === row.id ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
                        </svg>
                    ) : row.status === 'ACTIVE' ? (
                        <X className="h-6 w-6 font-bold" />
                    ) : (
                        <Check className="h-6 w-6 font-bold" />
                    )}
                </button>
            )
        }
    ]

    return (
        <div className="p-6 space-y-8">
            <ToastContainer />
            {loading ? (
                <div className="text-center text-purple-600 font-medium">⏳ Loading users...</div>
            ) : actions === 'add' ? (
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Add New User</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Name"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Phone"
                            value={newUser.phone}
                            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            className="border p-2 rounded"
                        />
                    </div>
                    <button
                        onClick={handleAddUser}
                        disabled={addLoading}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {addLoading ? 'Adding...' : 'Add User'}
                    </button>
                </div>
            ) : visibleUsers.length > 0 ? (
                <>
                    <p className="text-lg font-bold">All Users</p>
                    <div className="flex justify-end">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search users..."
                            className="border p-2 rounded w-full max-w-sm"
                        />
                    </div>
                    <DataTable data={visibleUsers} columns={columns} emptyMessage="No users found" />
                </>
            ) : (
                <div className="bg-white p-6 rounded-xl shadow-md text-center text-gray-600">
                    No users found.
                </div>
            )}
        </div>
    )
}

export default UsersPage

"use server"
import { cookies } from 'next/headers'


export async function getAuthAdmin() {
    const cookieStore = cookies()
    const auth = cookieStore.get('admin')
    return auth
}

export async function setAuthAdmin(token: string) {
    cookies().set('admin', token )
}

export async function deleteAuthAdmin() {
    cookies().set('admin', 'false' )
}





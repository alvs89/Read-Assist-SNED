import React, { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { AuthUser, UserRole } from "@/src/types"

interface AuthContextType {
  user: AuthUser | null
  login: (username: string, password: string, role: UserRole) => boolean
  updateUser: (updates: Partial<AuthUser>) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem("readassist_session_v1")
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem("readassist_session_v1", JSON.stringify(user))
    } else {
      localStorage.removeItem("readassist_session_v1")
    }
  }, [user])

  const login = (username: string, password: string, role: UserRole) => {
    if (!username.trim() || !password.trim()) return false
    setUser({
      id: "T-01",
      name: username.includes(".") ? username.split(".").map(capitalize).join(" ") : username,
      role,
      department: role === "School Administrator" ? "School Administration" : "SNED Dept. Alpha",
    })
    return true
  }

  const logout = () => setUser(null)

  const updateUser = (updates: Partial<AuthUser>) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev)
  }

  return (
    <AuthContext.Provider value={{ user, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

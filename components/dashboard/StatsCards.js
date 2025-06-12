"use client"

import { Book, Users, CheckCircle, Clock } from "lucide-react"

export function StatsCards({ books, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 rounded-md bg-gray-100">
                <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const totalBooks = books?.length || 0
  const uniqueAuthors = books ? new Set(books.map((book) => book.author)).size : 0
  const availableBooks = books ? books.filter((book) => book.status === "Available").length : 0
  const issuedBooks = books ? books.filter((book) => book.status === "Issued").length : 0

  const stats = [
    {
      title: "Total Books",
      value: totalBooks,
      icon: Book,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      textColor: "text-blue-600",
    },
    {
      title: "Authors",
      value: uniqueAuthors,
      icon: Users,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      textColor: "text-purple-600",
    },
    {
      title: "Available",
      value: availableBooks,
      icon: CheckCircle,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      textColor: "text-green-600",
    },
    {
      title: "Issued",
      value: issuedBooks,
      icon: Clock,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon
        return (
          <div key={index} className="bg-white rounded-md shadow-md p-6 hover:shadow-md transition-shadow   ">
            <div className="flex items-center">
              <div className={`p-2 rounded-md ${stat.bgColor}`}>
                <IconComponent className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
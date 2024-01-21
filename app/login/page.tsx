import Login from "components/Login"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md overflow-hidden bg-white px-6 py-12 shadow-md sm:rounded-lg">
        <Login />
      </div>
    </div>
  )
}

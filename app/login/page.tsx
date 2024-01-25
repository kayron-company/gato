import Link from "next/link"
import UserAuthForm from "components/forms/user-auth-form"

export default function LoginPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1 lg:px-0">
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            <p className="text-sm text-muted-foreground">Entre com sua conta do facebook abaixo</p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Ao clicar em continuar, você concorda com nossos{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Termos de serviço
            </Link>{" "}
            e{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Política de privacidade
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

import Cookies from "js-cookie"
import React, { useState } from "react"
import { toast } from "sonner"
import { Button } from "components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "components/ui/dialog"
import { Input } from "components/ui/input"
import { Label } from "components/ui/label"
import { formatWhatsApp } from "utils/maskUtils"

const PhoneModal = ({ isOpenPhoneModal, onClose }: { isOpenPhoneModal: boolean; onClose: () => void }) => {
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const token = Cookies.get("RT_accessToken")
    try {
      await fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/admin/user`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone_number: phoneNumber }),
      })

      toast.success("WhatsApp adicionado com sucesso!")
    } catch (error) {
      console.log(error)
      toast.error("Erro ao adicionar WhatsApp")
    }

    onClose()
  }

  const handleChange = (event: any) => {
    const formattedNumber = formatWhatsApp(event.target.value)
    setPhoneNumber(formattedNumber)
  }

  return (
    <Dialog open={isOpenPhoneModal}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Adicione seu WhatsApp</DialogTitle>
            <DialogDescription>Para envio imediato de leads, precisamos do seu número do WhatsApp.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                WhatsApp
              </Label>
              <Input
                id="number"
                value={phoneNumber}
                onChange={handleChange}
                placeholder="(XX) XXXXX-XXXX"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default PhoneModal

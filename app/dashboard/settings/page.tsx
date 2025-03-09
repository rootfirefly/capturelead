"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { updatePassword } from "firebase/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { User, Lock } from "lucide-react"

const profileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  whatsapp: z.string().min(10, "WhatsApp deve ter pelo menos 10 dígitos"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  isCompany: z.boolean(),
  companyName: z.string().optional(),
  cnpj: z.string().optional(),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "A senha atual deve ter pelo menos 6 caracteres"),
    newPassword: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
    confirmPassword: z.string().min(6, "A confirmação de senha deve ter pelo menos 6 caracteres"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  })

type ProfileFormValues = z.infer<typeof profileSchema>
type PasswordFormValues = z.infer<typeof passwordSchema>

export default function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      whatsapp: "",
      isCompany: false,
      companyName: "",
      cnpj: "",
    },
  })

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  })

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setUser(userData)
          profileForm.reset({
            name: userData.name || "",
            email: userData.email || "",
            whatsapp: userData.whatsapp || "",
            phone: userData.phone || "",
            isCompany: userData.isCompany || false,
            companyName: userData.companyName || "",
            cnpj: userData.cnpj || "",
          })
        }
      }
      setLoading(false)
    }
    fetchUserData()
  }, [profileForm])

  const onProfileSubmit = async (data: ProfileFormValues) => {
    try {
      const currentUser = auth.currentUser
      if (currentUser) {
        await setDoc(doc(db, "users", currentUser.uid), data, { merge: true })
        toast({
          title: "Perfil atualizado",
          description: "Suas informações foram salvas com sucesso.",
        })
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o perfil. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    try {
      const currentUser = auth.currentUser
      if (currentUser) {
        await updatePassword(currentUser, data.newPassword)
        toast({
          title: "Senha atualizada",
          description: "Sua senha foi alterada com sucesso.",
        })
        passwordForm.reset()
      }
    } catch (error) {
      console.error("Erro ao atualizar senha:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar a senha. Verifique sua senha atual e tente novamente.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full w-full">Carregando...</div>
  }

  return (
    <div className="h-full w-full overflow-auto">
      <div className="max-w-5xl mx-auto p-4 space-y-4">
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="password" className="flex items-center space-x-2">
              <Lock className="w-4 h-4" />
              <span>Senha</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Perfil do Usuário</CardTitle>
                <CardDescription>Atualize suas informações pessoais e de contato</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="whatsapp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>WhatsApp</FormLabel>
                            <FormControl>
                              <Input {...field} type="tel" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input {...field} type="tel" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Separator />
                    <FormField
                      control={profileForm.control}
                      name="isCompany"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Esta conta é de uma empresa</FormLabel>
                            <FormDescription>Marque esta opção se você está representando uma empresa</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    {profileForm.watch("isCompany") && (
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={profileForm.control}
                          name="companyName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome da Empresa</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={profileForm.control}
                          name="cnpj"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CNPJ</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                    <Button type="submit">Salvar Perfil</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>Atualize sua senha de acesso</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha Atual</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nova Senha</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar Nova Senha</FormLabel>
                            <FormControl>
                              <Input {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit">Alterar Senha</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


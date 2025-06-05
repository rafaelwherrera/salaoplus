import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";

import LoginForm from "./components/login-form";
import SignUpForm from "./components/sign-up-form";

const Login = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-pink-50 px-4">
      <Tabs
        defaultValue="login"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <TabsList className="mb-4 grid w-full grid-cols-2 rounded-lg bg-pink-100">
          <TabsTrigger
            value="login"
            className="cursor-pointer text-pink-700 data-[state=active]:bg-white data-[state=active]:text-pink-500 data-[state=active]:shadow-sm"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="register"
            className="cursor-pointer text-pink-700 data-[state=active]:bg-white data-[state=active]:text-pink-500 data-[state=active]:shadow-sm"
          >
            Registrar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <SignUpForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;

"use client";

import { motion } from "framer-motion";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import LoginForm from "./components/login-form";
import SignUpForm from "./components/sign-up-form";

const Login = () => {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-pink-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Tabs defaultValue="login" className="w-full">
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
      </motion.div>
    </div>
  );
};

export default Login;

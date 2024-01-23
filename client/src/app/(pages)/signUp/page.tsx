'use client';

import FormSignUp from "./components/formSignUp";
import SignIn  from "../../../assets/signin";

export default function Login() {
  return (
    <main className="w-full h-[100dvh] flex">
      <div className="h-[100dvh] w-full flex flex-col gap-6 justify-center items-center bg-slate-800">
          <FormSignUp />
          <a href="/signUp" className="font-semibold text-white not-italic hover:text-gray-300">
            Já tem conta? Iniciar sessão
          </a>
      </div>
      <div className="h-[100dvh] w-full justify-center items-center flex max-sm:hidden">
        <SignIn className="w-3/4" />
      </div>
    </main>
  );
}

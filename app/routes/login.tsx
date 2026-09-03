import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import abstractBg from "./abstract-bg.jpg";

import { Building2 } from "lucide-react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";

const loginFormSchema = z.object({
  email: z.email({ message: "Invalid email format" }),
  password: z.string().min(8, "Password should be at least 8 characters."),
});

export default function Login() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(loginCredentials: z.infer<typeof loginFormSchema>) {
    console.log(loginCredentials);
  }

  return (
    <>
      <main className="lg:grid lg:grid-cols-2 min-h-screen">
        <section className="bg-black/90 hidden lg:block">
          <img
            src={abstractBg}
            alt="abstract illustration"
            className="w-full h-screen object-cover opacity-25"
          />
        </section>

        <section className="flex flex-col px-8 lg:px-48 pt-32 bg-[#f6f7f8]">
          <div className="font-extrabold text-lg mb-12 flex gap-2 text-primary">
            <Building2 /> MultiShop
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <FieldSet>
              <FieldLegend className="font-bold">Welcome</FieldLegend>
              <FieldDescription>
                Enter your details below to continue
              </FieldDescription>

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-email">Email</FieldLabel>
                    <Input
                      {...field}
                      type="email"
                      id="login-email"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your email"
                      autoComplete="on"
                      className="h-12"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="login-password">Password</FieldLabel>
                    <Input
                      {...field}
                      type="password"
                      id="login-password"
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter your password"
                      autoComplete="on"
                      className="h-12"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button type="submit" className="w-full h-12">
                Log in
              </Button>
            </FieldSet>
          </form>
        </section>
      </main>
    </>
  );
}

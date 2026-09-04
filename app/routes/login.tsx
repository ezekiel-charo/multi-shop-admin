import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import abstractBg from "~/assets/images/abstract-bg.jpg";
import { Button } from "~/components/ui/button";

import { useMutation } from "@tanstack/react-query";
import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import Logo from "~/components/logo";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group";
import { login } from "~/services/auth";

const loginFormSchema = z.object({
  email: z.email({ message: "Invalid email format" }),
  password: z.string().min(8, "Password should be at least 8 characters."),
});

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      // navigate to the dashboard
      navigate("/dashboard");
    },
  });

  return (
    <>
      <title>MultiShop login</title>
      <meta name="description" content="Login to MultiShop" />
      <main className="lg:grid lg:grid-cols-2 min-h-screen">
        <section className="bg-black/90 hidden lg:block">
          <img
            src={abstractBg}
            alt="abstract illustration"
            className="w-full h-screen object-cover opacity-25"
          />
        </section>

        <section className="flex flex-col px-8 lg:px-48 pt-32 bg-[#f6f7f8]">
          <div className="mb-8">
            <Logo />
          </div>

          <form
            onSubmit={form.handleSubmit((credentials) => {
              mutation.mutate(credentials);
            })}
            className="w-full"
          >
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
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        type={showPassword ? "text" : "password"}
                        id="login-password"
                        aria-invalid={fieldState.invalid}
                        placeholder="Enter your password"
                        autoComplete="on"
                        className="h-12"
                      />
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          aria-label="Copy"
                          title="Copy"
                          size="icon-xs"
                          onClick={() => {
                            setShowPassword(!showPassword);
                          }}
                        >
                          {showPassword ? <EyeClosed /> : <Eye />}
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {mutation.isError && <FieldError errors={[mutation.error]} />}

              <Button
                disabled={mutation.isPending}
                type="submit"
                className="w-full h-12"
              >
                Log in
              </Button>
            </FieldSet>
          </form>
        </section>
      </main>
    </>
  );
}

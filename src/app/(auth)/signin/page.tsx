"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {  useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userSchema } from "@/schema/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiRespons } from "@/types/ApiResponse";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schema/signInSchema";
import { signIn } from "next-auth/react";

const page = () => {
  const { toast } = useToast();
  const router = useRouter();



  const [isSubmitting, setIsSubmitting] = useState(false);

  // zod impli

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

 
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
  try {
    const result =   await signIn("credentials", {
        redirect:false,
        identifier: data.identifier,
        password: data.password,
      });
      if (result?.error) {
        toast({
          title:"Login failed",
          description:result.error,
          variant:"destructive"
        })
      }
      toast({
        title: "Logged In successfully."
      });
      
      //  router.replace("/dashboard"); 
      
  } catch (error) {
    toast({
      title: "Login failed",
      description: "an unexpected error occured",
      variant: "destructive",
    });
  }
  finally{
    setIsSubmitting(false)
  }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              {" "}
              Welcome
            </h1>
            <p className="mb-4"> Sign in to start your anonymous adventure </p>
          </div>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email/Username</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="email or username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting }
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait{" "}
                  </>
                ) : (
                  "Signin"
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 hover:text-blue-800"
              >
                SignUp
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;

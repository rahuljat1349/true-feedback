"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceValue } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { userSchema } from "@/schema/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiRespons } from "@/types/ApiResponse";
import { useToast } from "@/components/ui/use-toast";

const page = () => {
  const { toast } = useToast();

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debouncedUsername = useDebounceValue(username, 500);

  // zod impli

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async function () {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username?username=${debouncedUsername}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiRespons>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "error checking username!"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [debouncedUsername]);

  const onSubmit = async (data: typeof userSchema) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiRespons>("/api/signup", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      console.error("error on signup of user", error);
      const axiosError = error as AxiosError<ApiRespons>;
      let errorMessage = axiosError.response?.data.message;

      toast({
        title: "SignUp failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div>page</div>;
};

export default page;

"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { messageSchema } from "@/schema/MessageSchema";
import { ApiRespons } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-separator";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const params = useParams();
  const username = params.username;

  const formMethods = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });

  const handleSendMessage = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiRespons>(`/api/send-message`, {
        username,
        content: data.content,
      });

      if (response.status === 200) {
        toast({
          title: "Success",
          description: "Message sent successfully",
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiRespons>;
      let errorMessage =
        axiosError.response?.data.message || "An error occurred";
      toast({
        title: "Message not sent",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <FormProvider {...formMethods}>
        <form
          className="space-y-6"
          onSubmit={formMethods.handleSubmit(handleSendMessage)}
        >
          <FormField
            control={formMethods.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="type something.."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </FormProvider>

      <Separator />
    </div>
  );
};

export default Page;

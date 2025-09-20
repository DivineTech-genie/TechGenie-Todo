"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { FormSchema, OtpValue } from "@/data/formValidation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { otpVerification } from "../app/(auth)/verifyOtp/page";
import { useUsersDetails } from "@/context/usersDetails";
import { useRouter } from "next/navigation";

export const OtpField = () => {
  const form = useForm<OtpValue>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  const { email, userName } = useUsersDetails();
  const router = useRouter();

  async function onSubmit(data: OtpValue) {
    console.log(email);

    const result = await otpVerification(data.pin, email, userName);

    if (result.success && result.userId) {
      router.push(`/todos/${result.userId}`);
    }
  }

  return (
    <div className="flex py-6 justify-center items-center shadow w-full max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter verification code sent to your email.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant={"custom"}>
            Verify Otp
          </Button>
        </form>
      </Form>
    </div>
  );
};

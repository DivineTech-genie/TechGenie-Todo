import { createClient } from "@/supabase/client";
import { OtpField } from "../../../components/OtpField";
import { toast } from "sonner";

export const otpVerification = async (
  otpValue: string,
  userEmail: string,
  userName: string
) => {
  const { error } = await createClient().auth.verifyOtp({
    email: userEmail,
    token: otpValue,
    type: "signup",
  });

  if (error) {
    console.error(error.message);
    toast.error("OTP verification failed");
    return { success: false, error };
  }

  if (!error) {
    const { data } = await createClient().auth.getUser();
    await createClient().from("users").insert({
      user_id: data.user?.id,
      user_name: userName,
      email: userEmail,
    });

    toast.success("Account created successfully!");
    return { success: true, userId: data.user?.id };
  }

  return { success: false };
};

const VerifyOtp = () => {
  return (
    <div className="container mx-auto flex h-screen w-sm md:w-screen flex-col items-center justify-center">
      <OtpField />
    </div>
  );
};

export default VerifyOtp;

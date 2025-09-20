import { SignInFormValues, SignUpFormValues } from "@/data/formValidation";
import { createClient } from "@/supabase/client";

import { toast } from "sonner";

export const signUp = async (values: SignUpFormValues) => {
  try {
    const { data, error } = await createClient().auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        // Optional: Add user metadata
        data: {
          name: values.name,
        },
      },
    });

    if (error) {
      toast.error("Sign up failed", {
        description: error.message,
      });
      return {
        success: false,
        message: "something went wrong pls try again",
      };
    }

    if (data.user) {
      toast.success("Check Your Email for Your Verification Code ");
      return {
        success: true,
        messgae: "Account created sucessfully!",
        userId: data.user.id,
      };
    }
  } catch (error) {
    console.error("Unexpected error during sign up:", error);
    toast.error("An unexpected error occurred during sign up");
    throw error;
  }
};

export const signIn = async (values: SignInFormValues) => {
  try {
    const {
      data: { user },
      error,
    } = await createClient().auth.signInWithPassword(values);

    if (error) {
      console.error("Error signing in user", error.message);
      toast.error("Error signing in Pls try again");
      return {
        success: false,
        message: "Error signing in Pls try again",
      };
    }

    if (user) {
      toast.success("signIn sucessful");
      return {
        success: true,
        message: "signIn sucessful",
        userId: user.id,
      };
    }
  } catch (error) {
    console.error(error);
  }
};

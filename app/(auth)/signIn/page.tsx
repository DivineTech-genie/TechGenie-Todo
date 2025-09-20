import AuthForm from "@/components/AuthForm";

export default function SignInPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <AuthForm defaultTab="signin" showSocialLogins={true} />
    </div>
  );
}

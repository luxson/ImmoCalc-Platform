import { SignIn } from "@clerk/nextjs";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
        <SignIn routing="hash" signInUrl="/sign-up"/>
    </div>
  );
};

export default LoginPage;
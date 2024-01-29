import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useSignInAccount } from "@/lib/react-query/queryAndMutations";
import { SigninValidation } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";


const SigninForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate();

  const { mutateAsync: signInAccount, isPending } = useSignInAccount();
  // 1.Define your form
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  const handleSignup = async (user: z.infer<typeof SigninValidation>)=> {
    try {
    const session = await signInAccount({
      email: user.email,
      password: user.password,
    })

    if(!session) {
      toast({ title: 'Sign in failed. Please try again. '})

      navigate("/sign-in");
      return;
    }

    const isLoggedIn = await checkAuthUser();

    if(isLoggedIn) {
      form.reset();
      navigate('/');
    } else {
      toast({ title: 'SignUp failed. Please try again. '});
      return;
    }
  } catch (error) {
    console.log(error);
  }
  };
  return (
      <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
          <img src="assets/icons/userSocial.svg" alt="logo" />
          <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log in to your account</h2>
          <p className="text-light-3 small-medium md:base-regular mt-2">Welcom Back! please,enter your details</p>

          <form onSubmit={form.handleSubmit(handleSignup)} className="flex flex-col gap-5 w-full mt-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
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
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit"
              className="shad-button_primary">
                {isUserLoading ? (
                  <div className="flex-center gap-2">
                    <Loader />Loading...
                  </div>
                ): "Sign-in"}
              </Button>

              <p className="text-small-regular text-light-2 text-center mt-2">
              Don't have an account?
              <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">Sign up</Link>
              </p>
          </form>
        </div>
      </Form>
  )
}

export default SigninForm
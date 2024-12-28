"use client";
import FormCreator from "@/src/components/form-creator";
import { signInUser } from "@/src/utils/get-url";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SignIn = (props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
    control,
  } = useForm();

  const router = useRouter();

  async function onSubmit(data) {
    console.log(data);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const collectionName = "user";

    if (emailRegex.test(data.userNameOrEmail)) {
      data.email = data.userNameOrEmail;
      data.userNameOrEmail = undefined;
    } else {
      data.userName = data.userNameOrEmail;
      data.userNameOrEmail = undefined;
    }

    let userData = {
      email: data.email ? data.email.toLowerCase() : null,
      userName: data.email ? null : data.userName,
      password: data.password,
    };
    console.log(userData);
    // function to singin a user
    try {
      if (typeof window !== "undefined") {
        const signInData = await signInUser(collectionName, userData);
        console.log(signInData, "signInData");
        if (signInData.success) {
          toast.success("User signed in successfully!");
          localStorage.setItem("name", signInData.user.name);
          localStorage.setItem("id", signInData.user.id);
          localStorage.setItem("role", signInData.user.role);
          window.dispatchEvent(new CustomEvent("userSignedIn"));
          router.push("/"); // Redirect to Events page
        } else {
          toast.error(signInData.error);
        }
      }
    } catch {
      toast.error("There was a problem signing in the user.");
    }
  }
  // const createWorldFields: FormField[] = [
  const createSignUpFields = [
    {
      label: "User Name or Email",
      name: "userNameOrEmail",
      errors: errors.name,
      field: "field",
      required: true,
    },
    {
      label: "Password",
      name: "password",
      inputType: "password",
      errors: errors.name,
      field: "field",
      required: true,
    },
  ];
  return (
    <div className="flex flex-col py-4  max-w-[450px] mx-auto w-full">
      <FormCreator
        key="createSignUp"
        fields={createSignUpFields}
        register={register}
        control={control}
        onSubmit={onSubmit}
        handleSubmit={handleSubmit}
        buttonText="Sign In"
      />
      <div className=" pt-4 font-bold self-center w-full text-center">
        New here?{" "}
        <a href="/signup" className="text-blue-600">
          Click here to Sign Up
        </a>
      </div>
    </div>
  );
};
export default SignIn;

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import hello from "./assets/mailss.png";
import { FcGoogle } from "react-icons/fc";
import { Button } from "./components/ui/button";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase.config";
import { useNavigate } from "react-router-dom";
import { LogInIcon } from "lucide-react";

const SignUp: React.FC = () => {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate(); // Hook to handle navigation

  const handleCheckboxChange = (id: string) => {
    setSelectedGender(id);
  };

  const signingUp = () => {
    console.log(email, password);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("User Info:", user);

        // Store user info
        localStorage.setItem("login", "true");
        localStorage.setItem("name", name || "");
        localStorage.setItem("gender", selectedGender || "");
        localStorage.setItem("email", user.email || "");

        navigate("/home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error Code:", errorCode);
        console.error("Error Message:", errorMessage);
      });
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const user = result.user;
        console.log("User Info:", user);
        console.log("Token:", token);

        // Store user info
        localStorage.setItem("login", "true");
        localStorage.setItem("name", user.displayName || "");
        localStorage.setItem("gender", selectedGender || "");
        localStorage.setItem("photoURL", user.photoURL || "");

        // Redirect to home page
        navigate("/home");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error Code:", errorCode);
        console.error("Error Message:", errorMessage);
      });
  };

  const items = [
    { id: "male", label: "Male" },
    { id: "female", label: "Female" },
  ];

  return (
    <div className="flex flex-col justify-center items-center p-4 w-full">
      <img src={hello} alt="Welcome" />
      <div className="heading text-2xl font-bold">Hey !!! Let's Onboard </div>

      <Button
        className="w-fit my-7"
        variant="outline"
        onClick={signInWithGoogle}
      >
        <FcGoogle size={25} className="mr-4 4" />
        <p className="font-bold ">Sign up with Google</p>
      </Button>
      <div className=" font-bold text-green-900 bg-green-200  p-2 rounded-xl">
        or
      </div>
      <div className="flex flex-col items-center p-4 my-4 w-full border rounded-2xl ">
        <label className="text-start font-bold w-full">Your Good Name :)</label>
        <Input
          type="text"
          placeholder="What should we call you?"
          required
          className="my-4 bg-gray-100 rounded-2xl"
          onInput={(e) => setName(e.currentTarget.value)}
        />

        <label className="text-start font-bold w-full">Email</label>
        <Input
          type="email"
          placeholder="Your Email"
          required
          className="my-4 bg-gray-100 rounded-2xl"
          onInput={(e) => setEmail(e.currentTarget.value)}
        />

        <label className="text-start font-bold w-full">Password</label>
        <Input
          type="password"
          placeholder="Password should be more than 6 characters"
          required
          className="my-4 bg-gray-100 rounded-2xl"
          onInput={(e) => setPassword(e.currentTarget.value)}
        />

        <label className="text-start font-bold w-full mt-10">
          Your Gender 😊
        </label>
        <div className="flex flex-row items-center justify-start my-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Checkbox
                id={item.id}
                className="bg-red-200"
                checked={selectedGender === item.id}
                onClick={() => handleCheckboxChange(item.id)}
              />
              <label htmlFor={item.id}>{item.label}</label>
            </div>
          ))}
        </div>

        <div className="flex w-full justify-center items-center gap-4">
          <Button className="w-full my-2" onClick={signingUp}>
            Sign Up
          </Button>
        </div>
      </div>
      <div className="my-2 flex justify-center items-center font-bold">
        <p className="mr-2">Already a User?</p>
        <Button variant="outline" onClick={() => navigate("/")}>
          Proceed to SignIn
        </Button>
      </div>
    </div>
  );
};

export default SignUp;

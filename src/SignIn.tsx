import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import hello from "./assets/welcome.png";
import { Button } from "./components/ui/button";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase.config";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const SignIn: React.FC = () => {
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate(); // Hook to handle navigation

  const handleCheckboxChange = (id: string) => {
    setSelectedGender(id);
  };

  const signingIn = () => {
    console.log(email, password);
    signInWithEmailAndPassword(auth, email, password)
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
        alert("User not found! Please SignUp.");
        navigate("/signup");
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
        window.location.reload();
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
      <div className="heading text-2xl font-bold">Hey , Welcome Back</div>

      <Button
        className="w-fit my-7"
        variant="outline"
        onClick={signInWithGoogle}
      >
        <FcGoogle size={25} className="mr-4 4" />
        <p className="font-bold ">SignIn with Google</p>
      </Button>

      <div className="flex flex-col items-center p-4 my-4 w-full border rounded-2xl">
        <label className="text-start font-bold w-full">Your Good Name :)</label>
        <Input
          type="text"
          placeholder="What Should I Call You?"
          required
          className="my-4 bg-gray-100 rounded-2xl"
          onInput={(e) => setName(e.currentTarget.value)}
        />

        <label className="text-start font-bold w-full">Email</label>
        <Input
          type="email"
          placeholder="Email"
          required
          className="my-4 bg-gray-100 rounded-2xl"
          onInput={(e) => setEmail(e.currentTarget.value)}
        />

        <label className="text-start font-bold w-full">Password</label>
        <Input
          type="password"
          placeholder="Password"
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

        <Button className="w-full my-10" onClick={signingIn}>
          Sign In
        </Button>

        <div className="my-2 flex justify-center items-center font-bold">
          <p className="mr-2">Already a user ..?</p>
          <Button variant="outline" onClick={() => navigate("/signup")}>
            Proceed to SignIn
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

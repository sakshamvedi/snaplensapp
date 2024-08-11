 import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import hello from "./assets/running.gif";
import { Button } from "./components/ui/button";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase.config";
import { useNavigate } from "react-router-dom";

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
        window.location.reload();
      })
      .catch((error) => {
        alert("User does not exist! Please sign up.");
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
      <div className="heading text-2xl font-bold">Hey !!! Welcome 👏</div>
      <div className="flex flex-col items-center p-4 my-20 w-full">
        <label className="text-start font-bold w-full">Your Good Name :)</label>
        <Input
          type="text"
          placeholder=""
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

        <label className="text-start font-bold w-full mt-10">Your Gender 😊</label>
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
        <div className="my-4">or</div>

        <Button className="w-full my-2" onClick={signInWithGoogle}>
          Sign in with Google
        </Button>

        <div className="my-4">
          <p>
            New user?{" "}
            <Button className="underline" onClick={() => navigate('/signup')}>
              Proceed to Sign Up
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

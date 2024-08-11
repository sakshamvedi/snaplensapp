import React from "react";
import { Input } from "@/components/ui/input";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import hello from "./assets/running.gif";
import { Button } from "./components/ui/button";
type Props = {};

function SignIn({}: Props) {
  const [selectedGender, setSelectedGender] = React.useState<string | null>(
    null
  );
  const [name, setName] = React.useState<string | null>(null);
  const handleCheckboxChange = (id: string) => {};

  function signingin() {
    localStorage.setItem("login", "true");
    localStorage.setItem("name", name);
    localStorage.setItem("gender", selectedGender);
    window.location.reload();
  }

  const items = [
    {
      id: "male",
      label: "Male",
    },
    {
      id: "female",
      label: "female",
    },
  ];
  return (
    <>
      <div className="flex flex-col justify-center items-center p-4   b w-full">
        <img src={hello}></img>
        <div className="heading text-2xl font-bold">Hey !!! Welcome 👏</div>
        <div className="flex flex-col  items-center p-4 my-20  w-full">
          <label className="text-start font-bold w-full">
            Your Good Name :)
          </label>
          <Input
            type="text"
            placeholder=""
            required
            className="my-4 bg-gray-100 rounded-2xl"
            onInput={(e) => setName(e.currentTarget.value)}
          />

          <label className="text-start font-bold w-full mt-10 ">
            Your Gender 😊
          </label>
          <div className="flex flex-row items-center justify-start my-4 gap-4 ">
            {items.map((item) => (
              <>
                <Checkbox
                  key={item.id}
                  id={item.id}
                  className="bg-red-200"
                  onClick={() => {
                    setSelectedGender(item.id);
                  }}
                />
                <label htmlFor={item.id}>{item.label}</label>
              </>
            ))}
          </div>
          <Button className="w-full my-10" onClick={signingin}>
            Submit
          </Button>
        </div>
      </div>
    </>
  );
}

export default SignIn;

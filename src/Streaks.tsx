import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
type Props = {};
import { HeartHandshake, PlusCircleIcon } from "lucide-react";
import Store from "./Store";
function Streaks({}: Props) {
  const [streaksTitle, setStreaksTitle] = React.useState("");
  const [streakid, setstreakId] = React.useState("");
  const { score, increaseScore, decreaseScore, resetScore } = Store();
  function generateRandomId() {
  
  }
  async function createStreaks() {
  
    try {
      if(score < 10){
        alert("You don't have enough score to create Streaks");
        return;
      }
      const response = await fetch("http://localhost:3000/createstreaks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: Math.random().toString(36).substring(7),
          name: streaksTitle,
          username: localStorage.getItem("username"),
          startDate: new Date().toISOString().slice(0, 10),
          score: 10,
        }),
      });
      if (response.ok) {
        decreaseScore(10);
        alert("Streaks created successfully");
      } else {
        alert("Failed to create Streaks");
      }
    } catch (error) {
      console.error("Error creating Streaks", error);
    }
  }

  return (
    <>
      <div className="createStreak">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="addButton flex gap-3">
              <PlusCircleIcon /> Create Streaks
            </Button>
          </DialogTrigger>
          <DialogContent className="w-80 top-40">
            <DialogHeader>
              <DialogTitle>Create A New Streak</DialogTitle>
              <DialogDescription>Min. Cost : 20xp</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Input
                  id="name"
                  type="text"
                  required
                  placeholder="For What Is This Streak ?"
                  className="col-span-3"
                  onChange={(e) => setStreaksTitle(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={createStreaks}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default Streaks;

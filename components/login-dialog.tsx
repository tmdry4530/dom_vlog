"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ isOpen, onOpenChange }: LoginDialogProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        console.log("로그인에 성공했습니다.");
        alert("로그인에 성공했습니다.");
        onOpenChange(false); // Close the dialog
        // You might want to redirect the user or refresh the page here
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("로그인 실패:", errorData.message || "로그인에 실패했습니다.");
        alert(errorData.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그인 중 오류가 발생했습니다.", error);
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-800 border-zinc-700 text-zinc-50">
        <form onSubmit={handleLogin}>
          <DialogHeader>
            <DialogTitle>로그인</DialogTitle>
            <DialogDescription>
              로그인하여 모든 기능을 이용해보세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                아이디
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="col-span-3 bg-zinc-700 border-zinc-600"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                비밀번호
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3 bg-zinc-700 border-zinc-600"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-zinc-50 text-zinc-900 hover:bg-zinc-200">
              로그인
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

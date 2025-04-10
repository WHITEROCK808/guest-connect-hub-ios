
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const StaffLogin = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Please enter both username and password");
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        toast.success("Login successful");
        navigate("/staff");
      } else {
        toast.error(t("staff.login.error"));
      }
    } catch (error) {
      toast.error("An error occurred during login");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <Card className="shadow-ios-strong">
        <CardHeader className="text-center">
          <CardTitle>{t("staff.login.title")}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t("staff.login.username")}</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="whiterockA, admin, etc."
                autoComplete="username"
                disabled={loading}
                className="ios-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("staff.login.password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
                className="ios-input"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full ios-button"
              disabled={loading}
            >
              {loading ? "Loading..." : t("staff.login.button")}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>Demo accounts:</p>
        <p className="mt-1">Staff: whiterockA / guest123</p>
        <p>Admin: admin / admin123</p>
      </div>
    </div>
  );
};

export default StaffLogin;

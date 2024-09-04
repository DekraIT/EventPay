import { Input } from '@/components/ui/input';
import { login } from './actions';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <form className="w-100 flex flex-col gap-4 p-4">
      <Label htmlFor="email">Email:</Label>
      <Input id="email" name="email" type="email" required />
      <Label htmlFor="password">Password:</Label>
      <Input id="password" name="password" type="password" required />
      <Button formAction={login}>Log in</Button>
      {/* <button formAction={signup}>Sign up</button> */}
    </form>
  );
}

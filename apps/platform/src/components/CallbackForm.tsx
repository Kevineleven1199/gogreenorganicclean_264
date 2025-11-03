import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export const CallbackForm = () => (
  <form className="space-y-4">
    <Input name="name" placeholder="Name" aria-label="Name" />
    <Input name="phone" placeholder="Phone Number" aria-label="Phone Number" />
    <Input name="website" placeholder="Website (optional)" aria-label="Website" />
    <Button type="submit" className="w-full">Send Request</Button>
  </form>
);


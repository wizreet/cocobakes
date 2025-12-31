import { useState } from 'react';
import { cx } from 'class-variance-authority';
import Input from './Input';
import TextArea from './TextArea';
import Button from './Button';

interface ContactFormProps {
  className?: string;
}

export function ContactForm({ className }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    // Reset form
    (e.target as HTMLFormElement).reset();
    
    // Reset success message after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cx(
        'grid grid-cols-1 gap-6 border-secondary bg px-6 py-8 lg:rounded-md lg:border lg:px-8 lg:shadow-of-bg-surface xl:grid-cols-2',
        className
      )}
    >
      <Input id="name" label="Name" placeholder="John Doe" />
      <Input id="email" label="Email" type="email" placeholder="john.doe@example.com" />
      <TextArea
        id="message"
        label="Message"
        placeholder="How can we assist you?"
        className="xl:col-span-2"
      />
      <Button
        type="submit"
        className="my-[0.3125rem] xl:col-span-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : submitted ? 'Message Sent!' : 'Send message'}
      </Button>
    </form>
  );
}

export default ContactForm;

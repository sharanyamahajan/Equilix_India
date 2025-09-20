import { Button } from "../ui/button";
import { EquilixLogo } from "../icons/equilix-logo";

export function AppFooter() {
    return (
        <footer id="contact" className="bg-secondary/50 text-foreground border-t">
            <div className="container mx-auto px-6 py-12 text-center">
                <h2 className="text-3xl font-bold font-headline">Join us in empowering the next generation.</h2>
                <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
                    If you're a developer, mental health professional, or investor who shares our vision, we'd love to hear from you.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button asChild size="lg">
                        <a href="https://mail.google.com/mail/?view=cm&fs=1&to=sharanyamahajan9@gmail.com" target="_blank">
                            Contact Us
                        </a>
                    </Button>
                    <Button asChild size="lg" variant="outline">
                         <a href="https://whatsapp.com/channel/0029VbBaJPm9WtCA6IKA6a1u" target="_blank">
                            Get Involved on WhatsApp
                        </a>
                    </Button>
                </div>
                <div className="mt-12 flex flex-col items-center gap-4">
                    <EquilixLogo className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Equilix. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

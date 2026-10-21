import type { Metadata } from "next";
import { Mail, MessageCircleWarning, ShieldAlert } from "lucide-react";
import { PolicyPage, PolicySection } from "@/components/policy-page";

export const metadata: Metadata = { title: "Contact — Ajnavi", description: "Contact Ajnavi for support, safety, privacy, and legal questions." };

export default function ContactsPage() {
  return <PolicyPage eyebrow="Contact us" title="We’re here to help." intro="Contact Ajnavi for support, safety concerns, privacy questions, or legal notices. Providing clear context helps us respond more effectively.">
    <div className="mb-10 grid gap-4 sm:grid-cols-3"><a href="mailto:bbd695@gmail.com?subject=Ajnavi%20Support" className="contact-card"><Mail size={22}/><strong>General support</strong><span>Questions and technical issues</span></a><a href="mailto:bbd695@gmail.com?subject=Ajnavi%20Safety%20Report" className="contact-card"><ShieldAlert size={22}/><strong>Safety</strong><span>Urgent platform concerns</span></a><a href="mailto:bbd695@gmail.com?subject=Ajnavi%20Privacy%20Request" className="contact-card"><MessageCircleWarning size={22}/><strong>Privacy</strong><span>Data and policy requests</span></a></div>
    <PolicySection title="Email"><p><a className="text-lg font-bold" href="mailto:bbd695@gmail.com">bbd695@gmail.com</a></p><p>When writing, include the type of issue, when it occurred, the browser or device involved, and any non-sensitive details that can help reproduce it.</p></PolicySection>
    <PolicySection title="Moderation questions"><p>If you are contacting us about a report, restriction, or blocked session, use the subject line “Moderation Review.” Include the approximate date and time, what happened, and why you believe a review is appropriate. Read the Community Rules first and do not send explicit screenshots or recordings by email.</p></PolicySection>
    <PolicySection title="Technical problems"><p>For a technical issue, include your device model, operating system, browser and version, the page or feature involved, steps that reproduce the problem, and the full text of any error. A screenshot is helpful when it does not contain another person, private conversation, or sensitive information.</p></PolicySection>
    <PolicySection title="Safety emergencies"><p>Use the in-chat Report control for behavior occurring during a conversation. If anyone is in immediate danger, contact local emergency services. Email is not monitored as an emergency response channel.</p></PolicySection>
    <PolicySection title="Privacy and legal requests"><p>Use the subject line “Privacy Request” or “Legal Notice” as appropriate. Do not send passwords, payment credentials, government identification, explicit media, or other unnecessary sensitive information by email.</p></PolicySection>
    <PolicySection title="Response expectations"><p>We aim to review messages promptly, but response times depend on the nature and volume of requests. Safety and security issues receive priority.</p></PolicySection>
  </PolicyPage>;
}

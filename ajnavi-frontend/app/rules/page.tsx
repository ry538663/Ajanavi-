import type { Metadata } from "next";
import { PolicyPage, PolicySection } from "@/components/policy-page";

export const metadata: Metadata = { title: "Community Rules — Ajnavi", description: "Rules for safe and respectful conversations on Ajnavi." };

export default function RulesPage() {
  return <PolicyPage eyebrow="Community guidelines" title="A safer space starts with you." intro="Ajnavi is built for spontaneous conversations, not harmful behavior. By using the service, you agree to follow these rules in every text and video chat.">
    <PolicySection title="Be respectful"><p>Treat every stranger as a real person. Harassment, bullying, hateful conduct, threats, intimidation, humiliation, and discriminatory abuse are not allowed.</p></PolicySection>
    <PolicySection title="Adults only"><p>You must be at least 18 years old to use Ajnavi. Do not misrepresent your age or encourage a minor to access the service.</p></PolicySection>
    <PolicySection title="Keep it appropriate"><p>Do not display or request nudity, sexual activity, graphic violence, self-harm, cruelty, or other shocking content. Sexual exploitation, grooming, and any content involving minors are strictly prohibited and may be reported to the appropriate authorities.</p></PolicySection>
    <PolicySection title="Use live video honestly"><p>Video chat is for face-to-face conversation. Keep your uncovered face visible in a reasonably well-lit frame. Do not replace your camera with recordings, virtual cameras, filters intended to impersonate someone, device screens, photographs, text cards, or unrelated streams. Do not leave a connected camera pointed at an empty room.</p></PolicySection>
    <PolicySection title="Protect privacy"><p>Do not share or solicit passwords, financial details, precise addresses, government identifiers, or other highly sensitive information. Never record, screenshot, publish, identify, or expose another person without their clear consent.</p></PolicySection>
    <PolicySection title="No scams, spam, or manipulation"><p>Do not advertise, solicit money, impersonate another person, distribute malware, promote illegal activity, or pressure someone to move to another platform. Automated access, bots, and attempts to disrupt or reverse-engineer the service are prohibited.</p></PolicySection>
    <PolicySection title="Use the safety controls"><p>Leave any conversation that makes you uncomfortable. Use Next to move on and Report when someone violates these rules. Reports help us identify abuse; knowingly submitting false or retaliatory reports is itself a violation.</p></PolicySection>
    <PolicySection title="You are responsible for your device"><p>Anything transmitted from your browser is treated as activity initiated by you. Do not lend an active session to another person, and check what is visible or audible before switching cameras. A brief or accidental prohibited display may still create harm and may be acted upon.</p></PolicySection>
    <PolicySection title="Respond safely"><p>Do not copy or retaliate against another user’s misconduct. End the conversation and report it. If you step away, disconnect first. Never agree to an offline meeting or share sensitive information unless you understand and accept the personal-safety risks.</p></PolicySection>
    <PolicySection title="Enforcement"><p>We may warn, restrict, suspend, or permanently block access when we reasonably believe these rules were violated. Serious or repeated conduct may be escalated to service providers or law enforcement when required to protect people or comply with law.</p></PolicySection>
  </PolicyPage>;
}

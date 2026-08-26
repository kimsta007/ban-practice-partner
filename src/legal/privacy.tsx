import { createRoot } from "react-dom/client"

import { LegalPage, List, MailLink, P, Section } from "./LegalPage"
import "../styles/index.css"

const ENTITY = "Behavior Analyst Network"
const UPDATED = "26 August 2026"

createRoot(document.getElementById("root")!).render(
  <LegalPage title="Privacy Policy" updated={UPDATED}>
    <P>
      This policy explains what {ENTITY} collects through banpractice.com, why we collect it, and
      what we do with it. We have tried to describe our actual practices plainly rather than list
      every possibility.
    </P>

    <Section heading="What we collect">
      <P>
        We collect the information you type into the application form, and nothing else. That is:
      </P>
      <List
        items={[
          "Your first and last name",
          "Your email address and mobile phone number",
          "The state you practice in",
          "Your BCBA certification status, current professional situation, and primary interest",
          "Optionally, a link to your BCBAfinder profile and a short message",
        ]}
      />
      <P>
        You choose what to send us. If you would rather not use the form, you can email us directly
        at <MailLink /> instead.
      </P>
    </Section>

    <Section heading="What we do not collect">
      <P>
        This website does not use cookies, analytics, advertising pixels, or any other tracking
        technology. We do not build a profile of your visit, and we do not know that you visited
        unless you submit the form or email us.
      </P>
      <P>
        We do not ask for or accept payment information. There is nothing to buy on this site, and
        we do not process card details anywhere.
      </P>
      <P>
        We do not ask for clinical information about clients or patients, and you should not send
        any. The application form is for information about your own professional background.
      </P>
    </Section>

    <Section heading="How we use it">
      <P>
        We use what you submit to review your application, to contact you about becoming a BAN
        Practice Partner, and to answer any question you asked us. We do not use it for anything
        else.
      </P>
      <P>
        We do not send marketing email to people who have only applied. If we ever want to send you
        something beyond a reply to your application, we will ask you first.
      </P>
      <P>We do not sell your information, and we do not share it for anyone else’s marketing.</P>
    </Section>

    <Section heading="Where it goes">
      <P>
        When you submit the form, it is sent to a function we run on Amazon Web Services in the US
        East (N. Virginia) region, which immediately turns it into two emails: one to our team, and
        a confirmation to you. We do not store your application in a database. After those emails
        are sent, the only copies that exist are the emails themselves.
      </P>
      <P>Two service providers handle that information on our behalf:</P>
      <List
        items={[
          "Amazon Web Services — hosts this website and sends the emails",
          "Google Workspace — hosts the mailbox our team reads",
        ]}
      />
      <P>
        Both act as our processors: they handle the data to provide their service to us, not for
        their own purposes.
      </P>
    </Section>

    <Section heading="How long we keep it">
      <P>
        Because your application lives in our email, it stays in our mailbox until we delete it. We
        keep applications while we are considering them and for a reasonable period afterwards in
        case we reconnect, and we delete them on request.
      </P>
    </Section>

    <Section heading="Consent, and changing your mind">
      <P>
        When you submit the form, you are consenting to us using that information to respond to your
        application. That is the only basis on which we hold it.
      </P>
      <P>
        You can withdraw that consent at any time by emailing <MailLink />. Tell us to stop
        contacting you, or to delete what you sent, and we will.
      </P>
    </Section>

    <Section heading="Your rights">
      <P>
        You can ask us to show you what we hold about you, correct it, or delete it. Email{" "}
        <MailLink /> and we will respond. There is no charge, and you do not need to give a reason.
      </P>
      <P>
        Depending on where you live, you may have additional rights under laws such as the
        California Consumer Privacy Act or the GDPR. We honor these requests regardless of where
        you live.
      </P>
    </Section>

    <Section heading="Disclosure">
      <P>
        We disclose your information only to the service providers named above, or where we are
        required to by law. We will not hand it over otherwise.
      </P>
    </Section>

    <Section heading="Security">
      <P>
        Traffic to this site and the application form is encrypted in transit using TLS. The
        resulting emails are held in Google Workspace mailboxes protected by our account security
        controls, and access is limited to the people reviewing applications.
      </P>
      <P>
        No method of transmission or storage is completely secure, and we cannot guarantee absolute
        security. If we ever become aware of a breach affecting your information, we will tell you.
      </P>
    </Section>

    <Section heading="Links to other sites">
      <P>
        This site links to bcbafinder.com and may link to other sites. Once you follow a link you
        are on someone else’s site, governed by their privacy practices, not ours. We encourage you
        to read them.
      </P>
    </Section>

    <Section heading="Age">
      <P>
        This site is intended for practicing behavior analysts and is not directed at children. We
        do not knowingly collect information from anyone under 18. By using the site you confirm you
        are at least the age of majority where you live.
      </P>
    </Section>

    <Section heading="Changes to this policy">
      <P>
        We may update this policy. Changes take effect when posted here, and the date at the top of
        this page will tell you when it last changed. If we make a change that materially affects
        information you have already sent us, we will contact you.
      </P>
    </Section>

    <Section heading="Contact">
      <P>
        Questions, requests, or complaints about privacy go to <MailLink />, and a person on our
        team will answer.
      </P>
    </Section>
  </LegalPage>,
)

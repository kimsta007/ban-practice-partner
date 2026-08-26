import { createRoot } from "react-dom/client"

import { LegalPage, List, MailLink, P, Section } from "./LegalPage"
import "../styles/index.css"

const ENTITY = "Behavior Analyst Network"
const GOVERNING_STATE = "the Commonwealth of Massachusetts"
const UPDATED = "26 August 2026"

createRoot(document.getElementById("root")!).render(
  <LegalPage title="Terms of Use" updated={UPDATED}>
    <P>
      These terms govern your use of banpractice.com, operated by {ENTITY} (“we”, “us”). By using
      the site or submitting an application, you agree to them. If you do not agree, please do not
      use the site.
    </P>

    <Section heading="What this site is">
      <P>
        banpractice.com describes the BAN Practice Partner model and lets experienced BCBAs apply to
        be considered for it. It is informational. Nothing on this site is an offer of employment, a
        partnership agreement, a franchise offering, or a promise of income.
      </P>
      <P>
        Any actual relationship between you and {ENTITY} would be governed by a separate written
        agreement signed by both of us. Until that exists, nothing here binds either party.
      </P>
    </Section>

    <Section heading="Who may use it">
      <P>
        You must be at least the age of majority where you live and legally able to enter into
        contracts. The site is aimed at behavior analysts practicing in the United States.
      </P>
    </Section>

    <Section heading="Applying">
      <P>
        Submitting an application does not guarantee a response, an interview, or acceptance. We
        review applications at our discretion and may decline any application for any lawful reason,
        or none.
      </P>
      <P>
        You agree that what you tell us is accurate — including your certification status and
        professional background — and that you are entitled to share it. Do not send us information
        that belongs to someone else, and do not send us any clinical or protected health
        information about clients or patients.
      </P>
      <P>
        By applying, you agree that we may contact you at the email address and phone number you
        provide, about your application.
      </P>
    </Section>

    <Section heading="Not professional advice">
      <P>
        Nothing on this site is legal, financial, tax, accounting, or clinical advice. Running a
        practice involves decisions specific to your circumstances, and you should take your own
        professional advice before making them.
      </P>
      <P>
        Nothing here alters your independent professional and ethical obligations as a certified
        behavior analyst, including those owed to your clients and to your certifying body.
      </P>
    </Section>

    <Section heading="Acceptable use">
      <P>You agree not to:</P>
      <List
        items={[
          "Use the site for any unlawful purpose",
          "Submit false, misleading, or someone else’s information",
          "Attempt to gain unauthorized access to the site or its underlying systems",
          "Interfere with the site’s operation, including by automated scraping or by flooding the application form",
          "Copy or reuse the site’s content or branding without our written permission",
        ]}
      />
    </Section>

    <Section heading="Our content">
      <P>
        The text, design, graphics, and the BAN name and logo on this site belong to {ENTITY} or are
        used with permission. You may read and share links to the site. You may not reproduce,
        adapt, or use our content or marks commercially without our written permission.
      </P>
    </Section>

    <Section heading="Links to other sites">
      <P>
        We link to sites we do not control, including bcbafinder.com. We are not responsible for
        their content, their practices, or anything you do there.
      </P>
    </Section>

    <Section heading="Availability">
      <P>
        We provide this site as it is and as it is available. We do not promise it will be
        uninterrupted, error-free, or continuously available, and we may change or withdraw it at
        any time without notice.
      </P>
    </Section>

    <Section heading="Disclaimers">
      <P>
        To the fullest extent permitted by law, we disclaim all warranties, express or implied,
        including any implied warranties of merchantability, fitness for a particular purpose, and
        non-infringement. We do not warrant that information on the site is complete, current, or
        accurate.
      </P>
    </Section>

    <Section heading="Limitation of liability">
      <P>
        To the fullest extent permitted by law, {ENTITY} will not be liable for any indirect,
        incidental, special, consequential, or punitive damages, or for lost profits or lost
        business opportunity, arising out of your use of this site — including any decision you make
        in reliance on it.
      </P>
      <P>
        Some jurisdictions do not allow certain limitations, so parts of this section may not apply
        to you.
      </P>
    </Section>

    <Section heading="Indemnity">
      <P>
        You agree to indemnify {ENTITY} against claims and costs arising from your misuse of the
        site, your breach of these terms, or your violation of anyone else’s rights.
      </P>
    </Section>

    <Section heading="Privacy">
      <P>
        Our handling of the information you submit is described in our{" "}
        <a href="/privacy.html" style={{ color: "#1660D4", fontWeight: 600 }}>
          Privacy Policy
        </a>
        , which forms part of these terms.
      </P>
    </Section>

    <Section heading="Changes">
      <P>
        We may update these terms. Changes take effect when posted here, and the date at the top of
        this page shows when they last changed. Continuing to use the site means you accept the
        current version.
      </P>
    </Section>

    <Section heading="Governing law">
      <P>
        These terms are governed by the laws of {GOVERNING_STATE}, without regard to its conflict of
        laws rules. Any dispute will be brought in the state or federal courts located there, and
        you agree to their jurisdiction.
      </P>
    </Section>

    <Section heading="Contact">
      <P>
        Questions about these terms go to <MailLink />.
      </P>
    </Section>
  </LegalPage>,
)

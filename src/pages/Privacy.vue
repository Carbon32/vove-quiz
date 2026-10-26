<script setup lang="ts">
import { RouterLink } from "vue-router"
import { ArrowLeft } from "lucide-vue-next"

const last_updated: string = "October 11, 2000"
</script>

<template>
    <main class="legal-page animate">
        <div class="legal-container">
            <header class="legal-header">
                <RouterLink to="/" class="logo">
                    GOPHER AUTH
                </RouterLink>

                <RouterLink to="/auth" class="back-link">
                    <ArrowLeft :size="16" />
                    Back to account
                </RouterLink>
            </header>

            <section class="legal-hero">
                <span class="eyebrow">PRIVACY</span>

                <h1>
                    Privacy
                    <span>Policy</span>
                </h1>

                <p>
                    We respect your privacy and are committed to protecting
                    the information you provide when using GOPHER AUTH.
                </p>

                <span class="updated">
                    Last updated: {{ last_updated }}
                </span>
            </section>

            <!-- I don't even remember where I got this from -->
            <article class="legal-content">
                <section>
                    <h2>1. Information we collect</h2>

                    <p>
                        When you create an account or use GOPHER AUTH, we may
                        collect information that you voluntarily provide to us.
                        This may include your name, email address, username,
                        password, phone number, and other information required
                        to provide our services.
                    </p>

                    <p>
                        We may also collect technical information such as your
                        browser type, device information, IP address, and
                        information about how you interact with the service.
                    </p>
                </section>

                <section>
                    <h2>2. How we use your information</h2>

                    <p>
                        We use the information we collect to operate, maintain,
                        and improve GOPHER AUTH.
                    </p>

                    <ul>
                        <li>To create and manage your account.</li>
                        <li>To authenticate you when you sign in.</li>
                        <li>To provide and personalize our services.</li>
                        <li>To communicate with you about your account.</li>
                        <li>To protect the security of our service.</li>
                        <li>To detect and prevent abuse or unauthorized access.</li>
                        <li>To improve the functionality and reliability of the service.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Passwords and authentication</h2>

                    <p>
                        Your password is not stored in plain text. Passwords
                        are processed using a secure password-hashing mechanism
                        before being stored.
                    </p>

                    <p>
                        Authentication tokens may be used to keep you signed in
                        and allow the application to recognize your authenticated
                        session.
                    </p>
                </section>

                <section>
                    <h2>4. Cookies and local storage</h2>

                    <p>
                        GOPHER AUTH may use browser storage technologies such as
                        local storage to store information necessary for the
                        application to function, including authentication
                        information and user preferences.
                    </p>

                    <p>
                        You can clear browser storage through your browser
                        settings. Doing so may sign you out of your account or
                        reset certain application preferences.
                    </p>
                </section>

                <section>
                    <h2>5. How we share information</h2>

                    <p>
                        We do not sell your personal information.
                    </p>

                    <p>
                        We may share information with service providers that
                        help us operate GOPHER AUTH when necessary to provide the
                        service. We may also disclose information when required
                        by applicable law, legal process, or to protect the
                        rights, security, and safety of our users or service.
                    </p>
                </section>

                <section>
                    <h2>6. Data security</h2>

                    <p>
                        We use reasonable technical and organizational measures
                        designed to protect your information from unauthorized
                        access, alteration, disclosure, or destruction.
                    </p>

                    <p>
                        However, no method of transmission or electronic storage
                        is completely secure, and we cannot guarantee absolute
                        security.
                    </p>
                </section>

                <section>
                    <h2>7. Data retention</h2>

                    <p>
                        We retain personal information for as long as reasonably
                        necessary to provide our services, maintain your account,
                        comply with legal obligations, resolve disputes, and
                        enforce our agreements.
                    </p>
                </section>

                <section>
                    <h2>8. Your rights</h2>

                    <p>
                        Depending on where you live, you may have rights regarding
                        your personal information, including the right to request
                        access, correction, deletion, restriction, or portability
                        of your information.
                    </p>

                    <p>
                        To make a privacy-related request, contact us using the
                        contact information provided by the service.
                    </p>
                </section>

                <section>
                    <h2>9. Children"s privacy</h2>

                    <p>
                        GOPHER AUTH is not intended for children who are not legally
                        permitted to use the service in their jurisdiction. We do
                        not knowingly collect personal information from children
                        where such collection is prohibited by applicable law.
                    </p>
                </section>

                <section>
                    <h2>10. Third-party services</h2>

                    <p>
                        GOPHER AUTH may rely on third-party services for hosting,
                        authentication, analytics, communication, or other
                        infrastructure. Those services may process information
                        according to their own privacy policies.
                    </p>
                </section>

                <section>
                    <h2>11. Changes to this policy</h2>

                    <p>
                        We may update this Privacy Policy from time to time.
                        When changes are made, the updated version will be
                        published on this page together with a new "Last updated"
                        date.
                    </p>
                </section>

                <section>
                    <h2>12. Contact</h2>

                    <p>
                        If you have questions or concerns about this Privacy
                        Policy or how your information is handled, please
                        contact us through the contact method provided by
                        GOPHER AUTH.
                    </p>
                </section>
            </article>

            <footer class="legal-footer">
                <RouterLink to="/terms">
                    Terms & Conditions
                </RouterLink>
            </footer>
        </div>
    </main>
</template>

<style scoped>
.legal-page {
    min-height: 100vh;
    color: #f2f2f2;
    padding: 32px 20px 80px;
}

.animate {
    opacity: 0;
    transform: translateY(30px);
    animation: fade_in 0.2s forwards;
}

.legal-page.animate {
    animation-delay: 0.2s;
}

@keyframes fade_in {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.legal-container {
    width: min(900px, 100%);
    margin: 0 auto;
}

.legal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 90px;
}

.logo {
    color: #f2f2f2;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-decoration: none;
}

.back-link {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: #888888;
    font-size: 13px;
    text-decoration: none;
    transition: color 0.2s ease;
}

.back-link:hover {
    color: #f2f2f2;
}

.legal-hero {
    max-width: 720px;
    margin-bottom: 70px;
}

.legal-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 28px;
    border: 1px solid #333333;
    border-radius: 12px;
    background: #242424;
    color: #a0a0a0;
}

.eyebrow {
    display: block;
    margin-bottom: 14px;
    color: #777777;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.14em;
}

.legal-hero h1 {
    margin: 0;
    color: #f2f2f2;
    font-size: clamp(42px, 7vw, 72px);
    line-height: 0.98;
    letter-spacing: -0.05em;
    font-weight: 700;
}

.legal-hero h1 span {
    display: block;
    color: #777777;
}

.legal-hero p {
    max-width: 620px;
    margin: 28px 0 18px;
    color: #a0a0a0;
    font-size: 17px;
    line-height: 1.7;
}

.updated {
    color: #666666;
    font-size: 12px;
}

.legal-content {
    padding-top: 10px;
    border-top: 1px solid #333333;
}

.legal-content section {
    padding: 38px 0;
    border-bottom: 1px solid #333333;
}

.legal-content h2 {
    margin: 0 0 16px;
    color: #e5e5e5;
    font-size: 20px;
    letter-spacing: -0.02em;
}

.legal-content p,
.legal-content li {
    color: #999999;
    font-size: 15px;
    line-height: 1.8;
}

.legal-content p {
    margin: 0 0 16px;
}

.legal-content p:last-child {
    margin-bottom: 0;
}

.legal-content ul {
    margin: 12px 0 0;
    padding-left: 22px;
}

.legal-content li {
    margin-bottom: 7px;
}

.legal-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-top: 50px;
    color: #555555;
    font-size: 12px;
}

.legal-footer a {
    color: #888888;
    text-decoration: none;
    transition: color 0.2s ease;
}

.legal-footer a:hover {
    color: #f2f2f2;
}

@media (max-width: 600px) {
    .legal-page {
        padding: 22px 18px 60px;
    }

    .legal-header {
        margin-bottom: 60px;
    }

    .legal-hero {
        margin-bottom: 50px;
    }

    .legal-hero p {
        font-size: 15px;
    }

    .legal-content section {
        padding: 30px 0;
    }
}
</style>
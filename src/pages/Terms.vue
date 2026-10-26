<script setup lang="ts">
import { RouterLink } from "vue-router"
import { ArrowLeft } from "lucide-vue-next"

const last_updated: string = "11 October, 2000"
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
                <span class="eyebrow">LEGAL</span>

                <h1>
                    Terms &
                    <span>Conditions</span>
                </h1>

                <p>
                    These terms explain the rules and conditions that apply
                    when you access or use GOPHER AUTH.
                </p>

                <span class="updated">
                    Last updated: {{ last_updated }}
                </span>
            </section>

            <!-- I don't remember where I got this from as well -->
            <article class="legal-content">
                <section>
                    <h2>1. Acceptance of these terms</h2>

                    <p>
                        By accessing or using GOPHER AUTH, you agree to be bound
                        by these Terms & Conditions. If you do not agree with
                        these terms, you should not use the service.
                    </p>
                </section>

                <section>
                    <h2>2. Eligibility</h2>

                    <p>
                        You must be legally permitted to use GOPHER AUTH under
                        the laws applicable to you. By creating an account,
                        you confirm that the information you provide is
                        accurate and that you have the right to use the service.
                    </p>
                </section>

                <section>
                    <h2>3. Your account</h2>

                    <p>
                        Some features may require you to create an account.
                        You are responsible for maintaining the confidentiality
                        of your account credentials and for activity that occurs
                        through your account.
                    </p>

                    <p>
                        You should notify us if you believe your account has
                        been accessed without authorization.
                    </p>
                </section>

                <section>
                    <h2>4. Accurate information</h2>

                    <p>
                        You agree to provide accurate, current, and complete
                        information when creating and maintaining your account.
                    </p>

                    <p>
                        You should update your information when necessary so
                        that information associated with your account remains
                        accurate.
                    </p>
                </section>

                <section>
                    <h2>5. Acceptable use</h2>

                    <p>
                        You agree not to use GOPHER AUTH in a way that violates
                        applicable laws or these terms.
                    </p>

                    <ul>
                        <li>Do not use the service for unlawful purposes.</li>
                        <li>Do not attempt to gain unauthorized access to the service.</li>
                        <li>Do not interfere with the operation or security of the service.</li>
                        <li>Do not attempt to access another user"s account.</li>
                        <li>Do not distribute malicious software or harmful code.</li>
                        <li>Do not abuse, overload, or intentionally disrupt the service.</li>
                    </ul>
                </section>

                <section>
                    <h2>6. User content</h2>

                    <p>
                        If GOPHER AUTH allows you to submit, upload, store, or
                        otherwise provide content, you remain responsible for
                        that content.
                    </p>

                    <p>
                        You must have the necessary rights and permissions to
                        provide content through the service and must ensure
                        that your content does not violate applicable laws or
                        the rights of others.
                    </p>
                </section>

                <section>
                    <h2>7. Intellectual property</h2>

                    <p>
                        Unless otherwise stated, GOPHER AUTH and its associated
                        software, design, branding, text, graphics, and other
                        materials are owned by or licensed to the service
                        operator and may be protected by intellectual property
                        laws.
                    </p>

                    <p>
                        You may not copy, modify, distribute, sell, or
                        commercially exploit protected portions of the service
                        without appropriate authorization.
                    </p>
                </section>

                <section>
                    <h2>8. Service availability</h2>

                    <p>
                        We aim to keep GOPHER AUTH available and reliable, but we
                        do not guarantee that the service will always be
                        available, uninterrupted, or error-free.
                    </p>

                    <p>
                        The service may occasionally be unavailable because of
                        maintenance, updates, technical problems, or circumstances
                        outside our control.
                    </p>
                </section>

                <section>
                    <h2>9. Third-party services</h2>

                    <p>
                        GOPHER AUTH may contain links to or integrations with
                        third-party websites and services. Those services are
                        operated independently and may have their own terms and
                        privacy policies.
                    </p>

                    <p>
                        We are not responsible for the content, availability,
                        or practices of third-party services.
                    </p>
                </section>

                <section>
                    <h2>10. Account suspension or termination</h2>

                    <p>
                        We may suspend or terminate an account when reasonably
                        necessary to protect the service, enforce these terms,
                        comply with legal obligations, or address unauthorized
                        or abusive activity.
                    </p>

                    <p>
                        You may stop using the service at any time.
                    </p>
                </section>

                <section>
                    <h2>11. Disclaimer</h2>

                    <p>
                        GOPHER AUTH is provided on an "as available" basis to the
                        extent permitted by applicable law. We do not guarantee
                        that the service will meet every requirement or that all
                        information provided through the service will always be
                        complete, accurate, or current.
                    </p>
                </section>

                <section>
                    <h2>12. Limitation of liability</h2>

                    <p>
                        To the maximum extent permitted by applicable law, the
                        service operator will not be responsible for indirect,
                        incidental, special, consequential, or similar damages
                        arising from your use of or inability to use the service.
                    </p>
                </section>

                <section>
                    <h2>13. Changes to these terms</h2>

                    <p>
                        We may update these Terms & Conditions from time to
                        time. Changes will be published on this page and the
                        "Last updated" date will be changed accordingly.
                    </p>

                    <p>
                        Your continued use of the service after updated terms
                        become effective constitutes acceptance of the updated
                        terms to the extent permitted by applicable law.
                    </p>
                </section>

                <section>
                    <h2>14. Governing law</h2>

                    <p>
                        These terms are subject to the laws applicable to the
                        service operator and its place of operation, except
                        where mandatory laws provide otherwise.
                    </p>
                </section>

                <section>
                    <h2>15. Contact</h2>

                    <p>
                        If you have questions about these Terms & Conditions,
                        please contact us using the contact method provided by
                        GOPHER AUTH.
                    </p>
                </section>
            </article>

            <footer class="legal-footer">
                <RouterLink to="/privacy">
                    Privacy Policy
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
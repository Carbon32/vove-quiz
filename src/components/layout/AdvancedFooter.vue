<script lang="ts" setup>
import {
    Mail,
    Phone,
    ArrowUp
} from "lucide-vue-next" // The social media icons are removed from this package so I made my own

import GitHubIcon from "../icons/GitHubIcon.vue";
import LinkedInIcon from "../icons/LinkedInIcon.vue";
import XIcon from "../icons/XIcon.vue";
import InstagramIcon from "../icons/InstagramIcon.vue";
import FacebookIcon from "../icons/FacebookIcon.vue";
import FooterDivider from "./FooterDivider.vue";
</script>

<template>
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-main">
                <div class="footer-brand">
                    <h2 class="footer-logo">Gopher Auth</h2>
                    <p class="footer-tagline">
                        An authentication system written in Go. And this is an example of its usage.
                    </p>

                    <div class="social-links">
                        <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                            class="social-link">
                            <GitHubIcon :size="18" />
                        </a>

                        <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                            class="social-link">
                            <LinkedInIcon :size="18" />
                        </a>

                        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X"
                            class="social-link">
                            <XIcon :size="18" />
                        </a>

                        <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer"
                            aria-label="Instagram" class="social-link">
                            <InstagramIcon :size="18" />
                        </a>

                        <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                            class="social-link">
                            <FacebookIcon :size="18" />
                        </a>

                        <a href="mailto:hello@example.com" aria-label="Email" class="social-link">
                            <Mail :size="18" />
                        </a>
                    </div>
                </div>

                <div class="footer-column">
                    <h3>Navigation</h3>
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                </div>

                <div class="footer-column">
                    <h3>Resources</h3>
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms and Conditions</a>
                </div>

                <div class="footer-column footer-contact">
                    <h3>Contact</h3>

                    <p class="contact-item">
                        <Phone :size="17" />
                        <span>
                            +143 4 121 010
                        </span>
                    </p>

                    <p class="contact-item">
                        <Mail :size="17" />
                        <span>
                            hello@example.com
                        </span>
                    </p>
                </div>
            </div>

            <FooterDivider />

            <div class="footer-bottom">
                <span>
                    &copy {{ new Date().getFullYear() }} Gopher Auth. All rights reserved (not really).
                </span>

                <a href="#" class="back-to-top" aria-label="Back to top">
                    Back to top
                    <ArrowUp :size="15" />
                </a>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    background: #1e1e1e;
    color: #c0c0c0;
    padding: 60px 20px 30px;
    font-family: "Inter", sans-serif;
}

.footer-container {
    max-width: 1100px;
    margin: 0 auto;
}

.footer-main {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.2fr;
    gap: 50px;
}

.footer-brand {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.footer-logo {
    margin: 0 0 12px;
    color: #ffffff;
    font-size: 1.4rem;
    font-weight: 700;
    letter-spacing: -0.02em;
}

.footer-tagline {
    margin: 0;
    max-width: 320px;
    color: #8f8f8f;
    font-size: 0.9rem;
    line-height: 1.6;
}

.social-links {
    display: flex;
    gap: 9px;
    margin-top: 22px;
}

.social-link {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 36px;
    height: 36px;

    color: #999;
    background: #292929;
    border: 1px solid #333;
    border-radius: 8px;

    transition:
        color 0.2s ease,
        background 0.2s ease,
        border-color 0.2s ease,
        transform 0.2s ease;
}

.social-link:hover {
    color: #fff;
    background: #333;
    border-color: #444;
    transform: translateY(-2px);
}

.footer-column {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 11px;
}

.footer-column h3 {
    margin: 0 0 7px;
    color: #ffffff;
    font-size: 0.85rem;
    font-weight: 600;
}

.footer-column a,
.footer-column span {
    color: #888;
    font-size: 0.85rem;
    text-decoration: none;
    transition: color 0.2s ease;
}

.footer-column a:hover {
    color: #fff;
}

.footer-column span {
    cursor: default;
}

.footer-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;

    color: #707070;
    font-size: 0.8rem;
}

.back-to-top {
    display: flex;
    align-items: center;
    gap: 6px;

    color: #808080;
    text-decoration: none;

    transition: color 0.2s ease;
}

.footer-contact {
    gap: 14px;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 12px;

    color: #aaa !important;
    text-decoration: none;

    transition: color 0.2s ease;
}

.contact-item svg {
    flex-shrink: 0;
    color: #707070;
    transition: color 0.2s ease;
}

.contact-item span {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.contact-item:hover {
    color: #fff !important;
}

.contact-item:hover svg {
    color: #aaa;
}

.back-to-top:hover {
    color: #fff;
}

@media (max-width: 768px) {
    .footer {
        padding: 45px 20px 25px;
    }

    .footer-main {
        grid-template-columns: 1fr 1fr;
        gap: 40px 30px;
    }

    .footer-brand {
        grid-column: 1 / -1;
    }

    .footer-bottom {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }
}

@media (max-width: 480px) {
    .footer-main {
        grid-template-columns: 1fr;
        gap: 30px;
    }

    .footer-brand {
        grid-column: auto;
    }

    .footer-column {
        align-items: flex-start;
    }
}
</style>
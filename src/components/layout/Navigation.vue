<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue"
import { useI18n } from "vue-i18n"
import { CircleUserRound, UserRoundCheck } from "lucide-vue-next"
import { useAuthStore } from "../../stores/auth"

const menu_open = ref(false)
const language_open = ref(false)
const { t, locale } = useI18n()

const auth = useAuthStore();

const languages = [
    {
        code: "en",
        name: "English",
    },
    {
        code: "fr",
        name: "Français",
    },
    {
        code: "es",
        name: "Español",
    },
]

function close_menu() {
    menu_open.value = false
    language_open.value = false
}

function change_language(language: string) {
    locale.value = language
    localStorage.setItem("language", language)
    update_document_language()
    language_open.value = false
}

function toggle_language_menu() {
    language_open.value = !language_open.value
}

function update_document_language() {
    document.documentElement.lang = locale.value
}

function load_saved_language() {
    const saved_language = localStorage.getItem("language")

    const language_exists = languages.some(
        (language) => language.code === saved_language
    )

    if (saved_language && language_exists) {
        locale.value = saved_language
    }

    update_document_language()
}

function handle_keydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
        menu_open.value = false
        language_open.value = false
    }
}

function handle_document_click(event: MouseEvent) {
    const target = event.target as HTMLElement

    if (!target.closest(".language-selector")) {
        language_open.value = false
    }
}

onMounted(() => {
    load_saved_language()
    window.addEventListener("keydown", handle_keydown)
    document.addEventListener("click", handle_document_click)
})

onBeforeUnmount(() => {
    window.removeEventListener("keydown", handle_keydown)
    document.removeEventListener("click", handle_document_click)
})

watch(locale, (new_language) => {
    localStorage.setItem("language", new_language)

    update_document_language()
})
</script>

<template>
    <nav class="navbar" aria-label="Main navigation">
        <div class="nav-wrapper">
            <button class="menu-btn" :class="{ active: menu_open }" :aria-expanded="menu_open"
                aria-controls="main-navigation" aria-label="Toggle navigation menu" type="button"
                @click="menu_open = !menu_open">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div id="main-navigation" class="nav-links" :class="{ open: menu_open }">
                <RouterLink class="nav-link" to="/" @click="close_menu">
                    {{ t("navigation.home") }}
                </RouterLink>

                <RouterLink class="nav-link" to="/about" @click="close_menu">
                    {{ t("navigation.about") }}
                </RouterLink>

                <RouterLink class="nav-link" to="/quiz" @click="close_menu">
                    {{ t("navigation.quiz") }}
                </RouterLink>

                <RouterLink class="nav-link" to="/history" @click="close_menu">
                    {{ t("navigation.history") }}
                </RouterLink>

                <RouterLink class="nav-link auth-mobile" to="/auth" @click="close_menu">
                    <UserRoundCheck v-if="auth.is_authenticated" :size="19" :stroke-width="1.8" />
                    <CircleUserRound v-else :size="19" :stroke-width="1.8" />

                    <span>
                        {{ t("navigation.authentication") }}
                    </span>
                </RouterLink>

                <div class="mobile-language">
                    <div class="language-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                            aria-hidden="true">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 0 1 0 20" />
                            <path d="M12 2a15.3 15.3 0 0 0 0 20" />
                        </svg>

                        <span>
                            {{ t("navigation.language") }}
                        </span>
                    </div>

                    <div class="language-selector mobile-selector">
                        <button class="language-button" :class="{ open: language_open }" type="button"
                            :aria-expanded="language_open" aria-haspopup="listbox" @click.stop="toggle_language_menu">

                            <span>
                                {{
                                    languages.find(
                                        (language) =>
                                            language.code === locale
                                    )?.name
                                }}
                            </span>

                            <svg class="chevron" :class="{ rotated: language_open }" xmlns="http://www.w3.org/2000/svg"
                                width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>


                        <div v-if="language_open" class="language-options" role="listbox">
                            <button v-for="language in languages" :key="language.code" class="language-option" :class="{
                                selected:
                                    locale === language.code,
                            }" type="button" role="option" :aria-selected="locale === language.code
                                " @click="
                                    change_language(language.code)
                                    ">

                                <span>
                                    {{ language.name }}
                                </span>

                                <svg v-if="locale === language.code" class="check-icon"
                                    xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" aria-hidden="true">
                                    <path d="m5 12 4 4L19 6" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="auth-desktop">
                <RouterLink class="auth-link" :to="auth.is_authenticated ? '/profile' : '/auth'"
                    :aria-label="t('navigation.authentication')" :title="t('navigation.authentication')">
                    <UserRoundCheck v-if="auth.is_authenticated" :size="19" :stroke-width="1.8" />
                    <CircleUserRound v-else :size="19" :stroke-width="1.8" />
                </RouterLink>
            </div>

            <div class="desktop-language">
                <svg class="language-icon" xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                    aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 0 20" />
                    <path d="M12 2a15.3 15.3 0 0 0 0 20" />
                </svg>


                <div class="language-selector">
                    <button class="language-button" :class="{ open: language_open }" type="button"
                        :aria-expanded="language_open" aria-haspopup="listbox" @click.stop="toggle_language_menu">

                        <span>
                            {{
                                languages.find(
                                    (language) =>
                                        language.code === locale
                                )?.name
                            }}
                        </span>

                        <svg class="chevron" :class="{ rotated: language_open }" xmlns="http://www.w3.org/2000/svg"
                            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>


                    <div v-if="language_open" class="language-options" role="listbox">
                        <button v-for="language in languages" :key="language.code" class="language-option" :class="{
                            selected:
                                locale === language.code,
                        }" type="button" role="option" :aria-selected="locale === language.code
                            " @click="
                                change_language(language.code)
                                ">

                            <span>
                                {{ language.name }}
                            </span>

                            <svg v-if="locale === language.code" class="check-icon" xmlns="http://www.w3.org/2000/svg"
                                width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="m5 12 4 4L19 6" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>


<style scoped>
.navbar {
    position: sticky;
    top: 0;
    z-index: 1000;
    height: 70px;
    background: #1e1e1e;
    border-bottom: 1px solid #333;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
}


.nav-wrapper {
    position: relative;
    max-width: 1100px;
    height: 100%;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}


.nav-links {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
}


.nav-link {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #aaa;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    padding: 10px 16px;
    border-radius: 9px;
    transition:
        color 0.2s ease,
        background 0.2s ease;
}


.nav-link:hover {
    color: #fff;
    background: #2a2a2a;
}


.nav-link.router-link-active {
    color: #fff;
    background: #303030;
}

.auth-desktop {
    position: absolute;
    right: -40px;
    height: 42px;
    display: flex;
    align-items: center;
}


.auth-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    color: #999da6;
    text-decoration: none;
    border-radius: 10px;
    transition:
        color 0.2s ease,
        background 0.2s ease;
}


.auth-link:hover {
    color: #ffffff;
    background: #2a2a2a;
}


.auth-link.router-link-active {
    color: #ffffff;
    background: #303030;
}


.auth-mobile {
    display: none;
}

.desktop-language {
    position: absolute;
    right: 20px;
    height: 42px;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 0 12px;
    background: rgba(255, 255, 255, 0.045);
    border: 1px solid rgba(255, 255, 255, 0.11);
    border-radius: 12px;
    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.035),
        0 3px 12px rgba(0, 0, 0, 0.12);
    transition:
        background 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}


.desktop-language:hover {
    background: rgba(255, 255, 255, 0.075);
    border-color: rgba(255, 255, 255, 0.17);
    box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.04),
        0 5px 18px rgba(0, 0, 0, 0.18);
}


.desktop-language:focus-within {
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow:
        0 0 0 3px rgba(255, 255, 255, 0.055),
        inset 0 1px 0 rgba(255, 255, 255, 0.04);
}


.language-icon {
    flex-shrink: 0;
    width: 17px;
    height: 17px;
    color: #999da6;
    transition: color 0.2s ease;
}


.desktop-language:hover .language-icon {
    color: #d0d2d7;
}


.language-selector {
    position: relative;
}


.language-button {
    min-width: 90px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 0 2px;
    color: #e4e5e8;
    background: transparent;
    border: none;
    outline: none;
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.1px;
    cursor: pointer;
}


.language-button .chevron {
    flex-shrink: 0;
    color: #858991;
    pointer-events: none;
    transition:
        color 0.2s ease,
        transform 0.2s ease;
}


.language-button:hover .chevron,
.language-button.open .chevron {
    color: #e0e1e4;
}


.language-button .chevron.rotated {
    transform: rotate(180deg);
}


.language-options {
    position: absolute;
    top: calc(100% + 9px);
    right: -3px;
    min-width: 150px;
    padding: 5px;
    background: #252525;
    border: 1px solid #3b3b3b;
    border-radius: 11px;
    box-shadow:
        0 12px 30px rgba(0, 0, 0, 0.35),
        0 2px 8px rgba(0, 0, 0, 0.2);
    animation: language-dropdown 0.15s ease-out;
}


.language-option {
    width: 100%;
    min-height: 38px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 2px;
    padding: 0 10px;
    color: #b9bbc0;
    background: transparent;
    border: none;
    border-radius: 7px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
    transition:
        color 0.15s ease,
        background 0.15s ease;
}


.language-option:hover {
    color: #fff;
    background: #303030;
}


.language-option.selected {
    color: #fff;
    background: #303030;
}


.check-icon {
    flex-shrink: 0;
    color: #d9dade;
}


.mobile-language {
    display: none;
}


.menu-btn {
    display: none;
    position: absolute;
    left: 15px;
    width: 40px;
    height: 40px;
    padding: 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    background: transparent;
    border: 1px solid #383838;
    border-radius: 9px;
    cursor: pointer;
    transition:
        background 0.2s ease,
        border-color 0.2s ease;
}


.menu-btn:hover {
    background: #292929;
    border-color: #444;
}


.menu-btn span {
    display: block;
    width: 21px;
    height: 2px;
    background: #bbb;
    border-radius: 2px;
    transition:
        transform 0.25s ease,
        opacity 0.2s ease;
}


.menu-btn.active span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
}


.menu-btn.active span:nth-child(2) {
    opacity: 0;
}


.menu-btn.active span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
}


@keyframes language-dropdown {

    from {
        opacity: 0;
        transform: translateY(-4px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }

}

@media (max-width: 1280px) {

    .navbar {
        height: 68px;
    }


    .nav-wrapper {
        padding: 0 15px;
    }


    .menu-btn {
        display: flex;
    }


    .desktop-language,
    .auth-desktop {
        display: none;
    }


    .nav-links {
        position: absolute;
        top: 68px;
        left: 12px;
        right: 12px;
        flex-direction: column;
        align-items: stretch;
        gap: 4px;
        padding: 10px;
        background: #202020;
        border: 1px solid #353535;
        border-top: none;
        border-radius: 0 0 14px 14px;
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-8px);
        pointer-events: none;
        transition:
            opacity 0.2s ease,
            transform 0.2s ease,
            visibility 0.2s ease;
    }


    .nav-links.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
        pointer-events: auto;
    }


    .nav-link {
        width: 100%;
        justify-content: flex-start;
        padding: 13px 15px;
        font-size: 15px;
    }


    .auth-mobile {
        display: flex;
        align-items: center;
        gap: 10px;
    }


    .auth-mobile svg {
        flex-shrink: 0;
    }


    .mobile-language {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        margin-top: 7px;
        padding: 13px 8px 5px;
        border-top: 1px solid #353535;
    }


    .language-label {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #999;
        font-size: 13px;
        font-weight: 500;
    }


    .language-label svg {
        flex-shrink: 0;
        color: #888d96;
    }


    .mobile-selector .language-button {
        min-width: 125px;
        height: 38px;
        padding: 0 11px;
        background: #292929;
        border: 1px solid #414141;
        border-radius: 9px;
    }


    .mobile-selector .language-options {
        top: calc(100% + 7px);
        right: 0;
        min-width: 125px;
    }


    .mobile-selector .language-option {
        min-height: 38px;
    }

}

@media (prefers-reduced-motion: reduce) {

    .nav-link,
    .menu-btn,
    .menu-btn span,
    .nav-links,
    .desktop-language,
    .auth-link,
    .language-button,
    .language-button .chevron,
    .language-option,
    .language-options {
        transition: none;
        animation: none;
    }

}
</style>
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const SECTIONS = [
    { label: "Science",  value: "Science"  },
    { label: "Commerce", value: "Commerce" },
    { label: "Arts",     value: "Arts"     },
];

/**
 * COUNTRY_CODES — phone prefix + resident-country data, merged into one list.
 *
 * Fields:
 *   label       — display text shown in the dropdown
 *   country     — English country name stored in DB as the `country` field
 *   code        — dial prefix used when building the full phone number
 *   searchText  — optional aliases searched by SingleSelect (for short labels like "UAE")
 *   description — optional badge text (e.g. "Recommended")
 *
 * When passed to <SingleSelect> map each entry with `value: entry.country` so
 * the unique key is the country name and onValueChange returns a country name.
 */
const COUNTRY_CODES = [
    // ── Most likely for BAMHS alumni (pinned first) ──────────────────
    { label: "🇧🇩  Bangladesh  (+880)",   country: "Bangladesh",        code: "+880", description: "Recommended" },
    { label: "🇮🇳  India  (+91)",          country: "India",             code: "+91"  },
    { label: "🇸🇦  Saudi Arabia  (+966)",  country: "Saudi Arabia",      code: "+966" },
    { label: "🇦🇪  UAE  (+971)",           country: "United Arab Emirates", code: "+971", searchText: "United Arab Emirates UAE" },
    { label: "🇶🇦  Qatar  (+974)",         country: "Qatar",             code: "+974" },
    { label: "🇰🇼  Kuwait  (+965)",        country: "Kuwait",            code: "+965" },
    { label: "🇧🇭  Bahrain  (+973)",       country: "Bahrain",           code: "+973" },
    { label: "🇴🇲  Oman  (+968)",          country: "Oman",              code: "+968" },
    { label: "🇲🇾  Malaysia  (+60)",       country: "Malaysia",          code: "+60"  },
    { label: "🇸🇬  Singapore  (+65)",      country: "Singapore",         code: "+65"  },
    { label: "🇬🇧  United Kingdom  (+44)", country: "United Kingdom",    code: "+44",  searchText: "United Kingdom UK Britain" },
    { label: "🇺🇸  United States  (+1)",   country: "United States",     code: "+1",   searchText: "United States USA America" },
    { label: "🇨🇦  Canada  (+1)",          country: "Canada",            code: "+1"   },
    { label: "🇦🇺  Australia  (+61)",      country: "Australia",         code: "+61"  },
    // ── Rest of the world (alphabetical) ────────────────────────────
    { label: "🇦🇫  Afghanistan  (+93)",    country: "Afghanistan",       code: "+93"  },
    { label: "🇦🇱  Albania  (+355)",       country: "Albania",           code: "+355" },
    { label: "🇩🇿  Algeria  (+213)",       country: "Algeria",           code: "+213" },
    { label: "🇦🇷  Argentina  (+54)",      country: "Argentina",         code: "+54"  },
    { label: "🇦🇲  Armenia  (+374)",       country: "Armenia",           code: "+374" },
    { label: "🇦🇹  Austria  (+43)",        country: "Austria",           code: "+43"  },
    { label: "🇦🇿  Azerbaijan  (+994)",    country: "Azerbaijan",        code: "+994" },
    { label: "🇧🇪  Belgium  (+32)",        country: "Belgium",           code: "+32"  },
    { label: "🇧🇷  Brazil  (+55)",         country: "Brazil",            code: "+55"  },
    { label: "🇧🇳  Brunei  (+673)",        country: "Brunei",            code: "+673" },
    { label: "🇧🇬  Bulgaria  (+359)",      country: "Bulgaria",          code: "+359" },
    { label: "🇨🇳  China  (+86)",          country: "China",             code: "+86"  },
    { label: "🇨🇴  Colombia  (+57)",       country: "Colombia",          code: "+57"  },
    { label: "🇭🇷  Croatia  (+385)",       country: "Croatia",           code: "+385" },
    { label: "🇨🇾  Cyprus  (+357)",        country: "Cyprus",            code: "+357" },
    { label: "🇨🇿  Czech Republic  (+420)",country: "Czech Republic",    code: "+420", searchText: "Czech Republic Czechia" },
    { label: "🇩🇰  Denmark  (+45)",        country: "Denmark",           code: "+45"  },
    { label: "🇪🇬  Egypt  (+20)",          country: "Egypt",             code: "+20"  },
    { label: "🇪🇹  Ethiopia  (+251)",      country: "Ethiopia",          code: "+251" },
    { label: "🇫🇮  Finland  (+358)",       country: "Finland",           code: "+358" },
    { label: "🇫🇷  France  (+33)",         country: "France",            code: "+33"  },
    { label: "🇩🇪  Germany  (+49)",        country: "Germany",           code: "+49"  },
    { label: "🇬🇭  Ghana  (+233)",         country: "Ghana",             code: "+233" },
    { label: "🇬🇷  Greece  (+30)",         country: "Greece",            code: "+30"  },
    { label: "🇭🇰  Hong Kong  (+852)",     country: "Hong Kong",         code: "+852" },
    { label: "🇭🇺  Hungary  (+36)",        country: "Hungary",           code: "+36"  },
    { label: "🇮🇩  Indonesia  (+62)",      country: "Indonesia",         code: "+62"  },
    { label: "🇮🇷  Iran  (+98)",           country: "Iran",              code: "+98"  },
    { label: "🇮🇶  Iraq  (+964)",          country: "Iraq",              code: "+964" },
    { label: "🇮🇪  Ireland  (+353)",       country: "Ireland",           code: "+353" },
    { label: "🇮🇱  Israel  (+972)",        country: "Israel",            code: "+972" },
    { label: "🇮🇹  Italy  (+39)",          country: "Italy",             code: "+39"  },
    { label: "🇯🇵  Japan  (+81)",          country: "Japan",             code: "+81"  },
    { label: "🇯🇴  Jordan  (+962)",        country: "Jordan",            code: "+962" },
    { label: "🇰🇿  Kazakhstan  (+7)",      country: "Kazakhstan",        code: "+7"   },
    { label: "🇰🇪  Kenya  (+254)",         country: "Kenya",             code: "+254" },
    { label: "🇰🇷  South Korea  (+82)",    country: "South Korea",       code: "+82",  searchText: "South Korea Korea" },
    { label: "🇱🇧  Lebanon  (+961)",       country: "Lebanon",           code: "+961" },
    { label: "🇱🇾  Libya  (+218)",         country: "Libya",             code: "+218" },
    { label: "🇲🇻  Maldives  (+960)",      country: "Maldives",          code: "+960" },
    { label: "🇲🇦  Morocco  (+212)",       country: "Morocco",           code: "+212" },
    { label: "🇲🇲  Myanmar  (+95)",        country: "Myanmar",           code: "+95",  searchText: "Myanmar Burma" },
    { label: "🇳🇵  Nepal  (+977)",         country: "Nepal",             code: "+977" },
    { label: "🇳🇱  Netherlands  (+31)",    country: "Netherlands",       code: "+31",  searchText: "Netherlands Holland" },
    { label: "🇳🇿  New Zealand  (+64)",    country: "New Zealand",       code: "+64"  },
    { label: "🇳🇬  Nigeria  (+234)",       country: "Nigeria",           code: "+234" },
    { label: "🇳🇴  Norway  (+47)",         country: "Norway",            code: "+47"  },
    { label: "🇵🇰  Pakistan  (+92)",       country: "Pakistan",          code: "+92"  },
    { label: "🇵🇭  Philippines  (+63)",    country: "Philippines",       code: "+63"  },
    { label: "🇵🇱  Poland  (+48)",         country: "Poland",            code: "+48"  },
    { label: "🇵🇹  Portugal  (+351)",      country: "Portugal",          code: "+351" },
    { label: "🇷🇴  Romania  (+40)",        country: "Romania",           code: "+40"  },
    { label: "🇷🇺  Russia  (+7)",          country: "Russia",            code: "+7"   },
    { label: "🇷🇼  Rwanda  (+250)",        country: "Rwanda",            code: "+250" },
    { label: "🇸🇳  Senegal  (+221)",       country: "Senegal",           code: "+221" },
    { label: "🇷🇸  Serbia  (+381)",        country: "Serbia",            code: "+381" },
    { label: "🇸🇱  Sierra Leone  (+232)",  country: "Sierra Leone",      code: "+232" },
    { label: "🇸🇰  Slovakia  (+421)",      country: "Slovakia",          code: "+421" },
    { label: "🇸🇴  Somalia  (+252)",       country: "Somalia",           code: "+252" },
    { label: "🇿🇦  South Africa  (+27)",   country: "South Africa",      code: "+27"  },
    { label: "🇪🇸  Spain  (+34)",          country: "Spain",             code: "+34"  },
    { label: "🇱🇰  Sri Lanka  (+94)",      country: "Sri Lanka",         code: "+94"  },
    { label: "🇸🇩  Sudan  (+249)",         country: "Sudan",             code: "+249" },
    { label: "🇸🇪  Sweden  (+46)",         country: "Sweden",            code: "+46"  },
    { label: "🇨🇭  Switzerland  (+41)",    country: "Switzerland",       code: "+41"  },
    { label: "🇸🇾  Syria  (+963)",         country: "Syria",             code: "+963" },
    { label: "🇹🇿  Tanzania  (+255)",      country: "Tanzania",          code: "+255" },
    { label: "🇹🇭  Thailand  (+66)",       country: "Thailand",          code: "+66"  },
    { label: "🇹🇳  Tunisia  (+216)",       country: "Tunisia",           code: "+216" },
    { label: "🇹🇷  Turkey  (+90)",         country: "Turkey",            code: "+90",  searchText: "Turkey Türkiye" },
    { label: "🇺🇦  Ukraine  (+380)",       country: "Ukraine",           code: "+380" },
    { label: "🇺🇬  Uganda  (+256)",        country: "Uganda",            code: "+256" },
    { label: "🇺🇿  Uzbekistan  (+998)",    country: "Uzbekistan",        code: "+998" },
    { label: "🇻🇳  Vietnam  (+84)",        country: "Vietnam",           code: "+84"  },
    { label: "🇾🇪  Yemen  (+967)",         country: "Yemen",             code: "+967" },
    { label: "🇿🇲  Zambia  (+260)",        country: "Zambia",            code: "+260" },
    { label: "🇿🇼  Zimbabwe  (+263)",      country: "Zimbabwe",          code: "+263" },
];

export const constantsData = {
    BLOOD_GROUPS,
    SECTIONS,
    COUNTRY_CODES,
}

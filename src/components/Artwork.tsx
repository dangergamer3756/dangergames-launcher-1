import { useId } from "react";

const cleanId = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "");

export function BrandMark({ className = "" }: { className?: string }) {
  const id = cleanId(useId());
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-edge`} x1="5" y1="4" x2="43" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFB347" />
          <stop offset="0.48" stopColor="#FF5C21" />
          <stop offset="1" stopColor="#D51B38" />
        </linearGradient>
        <linearGradient id={`${id}-fire`} x1="24" y1="9" x2="24" y2="39" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD36A" />
          <stop offset="0.48" stopColor="#FF7026" />
          <stop offset="1" stopColor="#FF2447" />
        </linearGradient>
      </defs>
      <path d="M24 2.5 43.5 13.5v21L24 45.5 4.5 34.5v-21L24 2.5Z" fill="#111823" stroke={`url(#${id}-edge)`} strokeWidth="2" />
      <path d="M24 2.5 43.5 13.5v21L24 45.5 4.5 34.5v-21L24 2.5Z" fill={`url(#${id}-edge)`} opacity="0.11" />
      <path d="M26.5 8.5c1.8 6.7-3.1 8.7-2.2 12.7 3.1-1.4 4.2-3.5 4.2-5.4 4.4 4.4 6 8.1 4.6 12.2-1.2 3.6-4 5.8-8.3 6.8 1.3-2.1 1.9-4.2 1.1-6.7-2.2 2-4.5 3.2-6.7 3.6-3-3.3-3.3-7.1-1.1-11.7 1.8-3.8 4.5-6.7 8.4-11.5Z" fill={`url(#${id}-fire)`} />
      <path d="M24 16.5c.5 4.7-3.6 6.1-2.3 9.5 2.6-.4 4.2-2.1 4.6-4.8 2.3 2.3 2.7 4.5 1.5 6.8-1 1.9-2.6 3.1-4.7 3.7 2.6-7.1-1.3-9.8.9-15.2Z" fill="#FFE1A0" opacity="0.9" />
    </svg>
  );
}

export function TacticalArtwork({ className = "" }: { className?: string }) {
  const id = cleanId(useId());
  const url = (name: string) => `url(#${id}-${name})`;

  return (
    <svg className={className} viewBox="0 0 1200 620" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1200" y2="620" gradientUnits="userSpaceOnUse">
          <stop stopColor="#080D15" />
          <stop offset="0.48" stopColor="#111D28" />
          <stop offset="1" stopColor="#2A1717" />
        </linearGradient>
        <radialGradient id={`${id}-flare`} cx="0" cy="0" r="1" gradientTransform="translate(875 260) rotate(90) scale(390 360)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFB653" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#FF5B21" stopOpacity="0.56" />
          <stop offset="1" stopColor="#FF2D20" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-armor`} x1="120" y1="30" x2="330" y2="520" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4B6070" />
          <stop offset="0.38" stopColor="#22313F" />
          <stop offset="1" stopColor="#0B121C" />
        </linearGradient>
        <linearGradient id={`${id}-plate`} x1="140" y1="200" x2="300" y2="470" gradientUnits="userSpaceOnUse">
          <stop stopColor="#354A5A" />
          <stop offset="0.55" stopColor="#172532" />
          <stop offset="1" stopColor="#0C141E" />
        </linearGradient>
        <linearGradient id={`${id}-visor`} x1="140" y1="90" x2="290" y2="135" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE19A" />
          <stop offset="0.35" stopColor="#FF782F" />
          <stop offset="1" stopColor="#A81825" />
        </linearGradient>
        <pattern id={`${id}-grid`} width="52" height="52" patternUnits="userSpaceOnUse">
          <path d="M52 0H0V52" fill="none" stroke="#6B8292" strokeWidth="1" opacity="0.28" />
        </pattern>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="45" />
        </filter>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="1200" height="620" fill={url("bg")} />
      <rect width="1200" height="620" fill={url("grid")} opacity="0.24" />
      <circle cx="880" cy="270" r="350" fill={url("flare")} opacity="0.8" filter={url("blur")} />
      <circle cx="930" cy="210" r="225" fill="#FF6B2A" opacity="0.12" filter={url("blur")} />

      {/* Angular city silhouettes */}
      <g opacity="0.7">
        <path d="M0 248h92v372H0zM92 190h62l30 80-30 350H92zM184 292h70v328h-70zM254 230h48l34 80-34 310h-48z" fill="#0B141E" />
        <path d="M1000 205h58v415h-58zM1058 130h46l34 90-34 400h-46zM1104 274h96v346h-96z" fill="#101720" />
        <path d="M318 350h44v270h-44zM362 310h26v310h-26zM1140 360h60v260h-60z" fill="#0C131C" />
        <g stroke="#FF7433" strokeWidth="2" opacity="0.34">
          <path d="M92 218h56M1058 162h42M1104 302h96M184 318h70" />
        </g>
      </g>

      {/* Perspective floor */}
      <g stroke="#FF8A45" strokeWidth="1.2" opacity="0.19">
        {Array.from({ length: 11 }).map((_, index) => (
          <path key={`floor-${index}`} d={`M${index * 145 - 150} 620 L${500 + index * 28} 385`} />
        ))}
        <path d="M0 430H1200M0 475H1200M0 530H1200M0 590H1200" />
      </g>

      {/* Tactical HUD rings */}
      <g fill="none" stroke="#FF9A55" opacity="0.2">
        <circle cx="880" cy="290" r="230" strokeDasharray="7 15" />
        <circle cx="880" cy="290" r="174" strokeDasharray="3 10" />
        <path d="M650 290h-95M1105 290h95M880 60V0M880 520v100" strokeWidth="1.5" />
      </g>
      <g stroke="#FF6C2D" strokeWidth="2" opacity="0.6" filter={url("glow")}>
        <path d="M420 190h58m-29-29v58M455 190h-12M420 190v-12" />
        <path d="M538 128h34m-17-17v34" />
      </g>
      <g fontFamily="monospace" fontSize="11" letterSpacing="3" fill="#FFA66A" opacity="0.56">
        <text x="50" y="555">SQUAD LINK // ACTIVE</text>
        <text x="1035" y="72">SECTOR 07</text>
        <text x="558" y="108">WAVE 01 — INCOMING</text>
      </g>

      {/* Central operative */}
      <g transform="translate(710 45)">
        <ellipse cx="215" cy="540" rx="205" ry="32" fill="#05080D" opacity="0.7" />
        <path d="M110 195 54 225 25 345 83 370 130 270Z" fill="#101A25" stroke="#455B6B" strokeWidth="3" />
        <path d="M320 195 376 225 405 345 347 370 300 270Z" fill="#101A25" stroke="#455B6B" strokeWidth="3" />
        <path d="M118 205 177 178h76l59 27 44 325H74Z" fill={url("armor")} stroke="#536B7B" strokeWidth="3" />
        <path d="M139 224h152l25 270H114Z" fill={url("plate")} opacity="0.95" />
        <path d="M168 246h94l16 88H152Z" fill="#263847" stroke="#5D7688" strokeWidth="2" />
        <path d="M215 246v88M152 290h126" stroke="#627D8D" strokeWidth="1.5" opacity="0.7" />
        <path d="M142 356h146l11 138H131Z" fill="#101B27" stroke="#3D5364" strokeWidth="2" />
        <path d="M178 374h74l8 42h-90Z" fill="#1B2B38" stroke="#526B7B" strokeWidth="2" />
        <path d="M215 374v42" stroke="#FF7433" strokeWidth="3" opacity="0.85" />
        <path d="M137 225 95 247 74 333l39 17 40-90Z" fill="#243746" stroke="#6C8595" strokeWidth="2" />
        <path d="M293 225 335 247 356 333l-39 17-40-90Z" fill="#243746" stroke="#6C8595" strokeWidth="2" />
        <path d="M96 247h30M304 247h30" stroke="#FF6B2C" strokeWidth="5" opacity="0.9" filter={url("glow")} />
        <path d="M174 160h82l12 43H162Z" fill="#0A111A" stroke="#51697A" strokeWidth="2" />
        <path d="M124 94C124 42 160 15 215 15s91 27 91 79l-13 76H137Z" fill={url("armor")} stroke="#607989" strokeWidth="3" />
        <path d="M136 52c20-25 48-37 79-37s59 12 79 37" fill="none" stroke="#91A7B4" strokeWidth="4" opacity="0.55" />
        <path d="M144 91h142l-13 46H157Z" fill="#060C13" stroke="#435A6B" strokeWidth="2" />
        <path d="M156 101h118l-8 24H164Z" fill={url("visor")} opacity="0.92" filter={url("glow")} />
        <path d="M215 15v50M160 58h110" stroke="#91A7B4" strokeWidth="2" opacity="0.4" />
        <path d="M137 148h156l-7 25H144Z" fill="#1A2A37" stroke="#5C7484" strokeWidth="2" />
        <path d="M202 149h26l-4 24h-18Z" fill="#FF7130" opacity="0.9" />
        <path d="M128 96 105 112l-4 48 27 16 14-80ZM302 96l23 16 4 48-27 16-14-80Z" fill="#263A49" stroke="#708A9B" strokeWidth="2" />

        {/* Rifle and hands */}
        <g transform="rotate(-9 215 405)">
          <path d="M-5 397h318v34H-5Z" fill="#0C141D" stroke="#637D8D" strokeWidth="2" />
          <path d="M80 397h138v34H80Z" fill="#1C2D3B" stroke="#748D9D" strokeWidth="2" />
          <path d="M313 404h92v20h-92Z" fill="#2A3C4B" stroke="#8097A6" strokeWidth="2" />
          <path d="M405 409h42v10h-42Z" fill="#FF6A2B" opacity="0.85" />
          <path d="M105 431h35v58h-35ZM225 431h35v58h-35Z" fill="#152330" stroke="#526B7B" strokeWidth="2" />
          <path d="M145 383h92v14h-92Z" fill="#0A111A" stroke="#6C8494" strokeWidth="2" />
          <path d="M160 383v-17h62v17" fill="none" stroke="#6C8494" strokeWidth="2" />
          <path d="M28 407h44M235 407h44" stroke="#FF7633" strokeWidth="4" opacity="0.85" />
        </g>
        <path d="M105 380c17-13 37-10 48 2l-8 43c-20 8-39 0-48-13Z" fill="#2F4555" stroke="#7A91A0" strokeWidth="2" />
        <path d="M277 380c-17-13-37-10-48 2l8 43c20 8 39 0 48-13Z" fill="#2F4555" stroke="#7A91A0" strokeWidth="2" />
      </g>

      {/* Foreground effects */}
      <g fill="#FFB473">
        {[
          [624, 224, 3], [690, 380, 2], [1010, 128, 3], [1085, 418, 2],
          [548, 310, 2], [1140, 215, 3], [760, 148, 2], [980, 510, 2],
        ].map(([cx, cy, r], index) => (
          <circle key={`spark-${index}`} cx={cx} cy={cy} r={r} opacity={0.35 + index * 0.05} />
        ))}
      </g>
      <path d="M0 0h1200v620H0z" fill="none" stroke="#FF7433" strokeWidth="2" opacity="0.1" />
    </svg>
  );
}

export function PrototypeArtwork({
  variant = 1,
  accent = "#FF6B2C",
  className = "",
}: {
  variant?: 1 | 2 | 3;
  accent?: string;
  className?: string;
}) {
  const id = cleanId(useId());
  const url = (name: string) => `url(#${id}-${name})`;

  return (
    <svg className={className} viewBox="0 0 420 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="420" y2="220" gradientUnits="userSpaceOnUse">
          <stop stopColor="#101821" />
          <stop offset="0.55" stopColor="#171520" />
          <stop offset="1" stopColor="#080C13" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="0" cy="0" r="1" gradientTransform="translate(250 105) rotate(90) scale(130 180)" gradientUnits="userSpaceOnUse">
          <stop stopColor={accent} stopOpacity="0.55" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <pattern id={`${id}-grid`} width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M28 0H0V28" fill="none" stroke="#91A1B1" strokeWidth="0.7" opacity="0.2" />
        </pattern>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>
      <rect width="420" height="220" fill={url("bg")} />
      <rect width="420" height="220" fill={url("grid")} />
      <ellipse cx="250" cy="110" rx="160" ry="90" fill={url("glow")} filter={url("blur")} />
      <g fill="none" stroke={accent} opacity="0.28">
        <circle cx="222" cy="110" r="78" strokeDasharray="4 9" />
        <circle cx="222" cy="110" r="52" strokeDasharray="2 7" />
        <path d="M0 110h122m200 0h98M222 0v58m0 104v58" />
      </g>

      {variant === 1 && (
        <g>
          <path d="M110 176 178 72l46 58 42-42 74 88Z" fill="#0C121A" stroke={accent} strokeWidth="1.5" opacity="0.85" />
          <path d="m178 72 20 104 26-46 42-42" fill="none" stroke="#FFC07A" strokeWidth="1.5" opacity="0.55" />
          <path d="M290 42h76M290 52h42M290 62h58" stroke={accent} strokeWidth="2" opacity="0.5" />
          <circle cx="222" cy="110" r="10" fill={accent} opacity="0.55" />
        </g>
      )}
      {variant === 2 && (
        <g>
          <path d="M165 170 225 48l65 122Z" fill="#0B111A" stroke={accent} strokeWidth="2" />
          <path d="M225 48v122M190 135h70" stroke="#FFB37A" strokeWidth="1.5" opacity="0.7" />
          {Array.from({ length: 7 }).map((_, index) => (
            <path key={`speed-${index}`} d={`M${20 + index * 11} ${165 + index * 8}l90-90`} stroke={accent} strokeWidth="2" opacity={0.16 + index * 0.04} />
          ))}
          <path d="M282 62h88M302 76h68M322 90h48" stroke="#FFD0A0" strokeWidth="2" opacity="0.42" />
        </g>
      )}
      {variant === 3 && (
        <g>
          <circle cx="222" cy="110" r="62" fill="#080C13" stroke="#FFA45D" strokeWidth="2" />
          <circle cx="242" cy="98" r="62" fill="#15141C" stroke={accent} strokeWidth="1.5" opacity="0.9" />
          <path d="M104 110h236M222 20v180" stroke={accent} strokeWidth="1" opacity="0.25" strokeDasharray="6 8" />
          <path d="M298 48a92 92 0 0 1 0 124" fill="none" stroke="#FFD29A" strokeWidth="2" opacity="0.55" />
          <circle cx="222" cy="110" r="6" fill={accent} />
        </g>
      )}

      <g fill={accent} opacity="0.65">
        <circle cx="52" cy="42" r="2" /><circle cx="368" cy="172" r="2" />
        <circle cx="342" cy="34" r="1.5" /><circle cx="82" cy="182" r="1.5" />
      </g>
      <rect x="0.5" y="0.5" width="419" height="219" fill="none" stroke={accent} strokeWidth="1" opacity="0.12" />
    </svg>
  );
}

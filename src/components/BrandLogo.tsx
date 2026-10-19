// Logo paths and wordmark copied from the user-selected reference website:
// https://plan-kraft-roof-protection.socialrook16.chatgpt.site/
export default function BrandLogo() {
  return (
    <span className="brand-logo" aria-hidden="true">
      <svg className="brand-logo-mark" viewBox="0 0 58 55" focusable="false">
        <path fill="#007da4" d="m3 32 24-19 10 8 8-6 11 13-8-5-13 2-5 15H7z" />
        <path fill="#fff" d="m28 23-7 8v10h15V31z" />
        <path fill="#a8c52a" d="M1 44c20 1 25-15 56-7C34 35 25 53 1 44" />
        <path
          fill="#007da4"
          d="M16 3s-4 5-4 7a4 4 0 0 0 8 0c0-2-4-7-4-7M26 0s-3 4-3 6a3 3 0 0 0 6 0c0-2-3-6-3-6M7 13s-3 4-3 6a3 3 0 0 0 6 0c0-2-3-6-3-6"
        />
        <path fill="#a8c52a" d="M25 33h4v4h-4zm5 0h4v4h-4z" />
      </svg>
      <span className="brand-logo-type">
        plan<span>kraft</span>
        <small>WATERPROOFING SOLUTIONS</small>
      </span>
    </span>
  );
}

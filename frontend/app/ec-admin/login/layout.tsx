// Override the parent ec-admin layout so the login page
// renders fullscreen without the admin sidebar.
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Login | Al-Juraat Al-Tibbiya',
};

export default function LoginPage() {
  return <JwtLoginView />;
}

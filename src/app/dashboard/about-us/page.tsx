import { fetchAbout } from 'src/actions/pages-actions';

import AboutUsView from 'src/sections/about-us/view/aboutUs';

import { Slug } from 'src/types/pages';

export const metadata = {
  title: 'About Us | Al-Juraat Al-Tibbiya',
};

export default async function Page() {
  const about = await fetchAbout();

   return <AboutUsView about={about as  Slug} />;
}

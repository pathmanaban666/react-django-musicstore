export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-purple-700 text-white text-center py-6 mt-4">
     Designed by Pathmanaban. © {currentYear} MusicStore. All rights reserved.
    </footer>
  );
};

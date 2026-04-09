import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[var(--color-surface-container-low)] border-t ghost-border py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-xl font-bold tracking-tight text-[var(--color-primary)]">Attenda.</span>
          <p className="text-sm mt-2 text-[var(--color-on-surface-variant)] max-w-sm">The digital concierge for your events. Effortless RSVP, smart guest management, and seamless check-ins.</p>
        </div>
        <div className="flex gap-12">
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-[var(--color-primary)] mb-1">Product</span>
            <Link to="/pricing" className="text-sm hover:text-[var(--color-primary)] transition-colors text-[var(--color-on-surface-variant)]">Pricing</Link>
            <Link to="/about" className="text-sm hover:text-[var(--color-primary)] transition-colors text-[var(--color-on-surface-variant)]">About Us</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="font-semibold text-[var(--color-primary)] mb-1">Company</span>
            <Link to="/contact" className="text-sm hover:text-[var(--color-primary)] transition-colors text-[var(--color-on-surface-variant)]">Contact</Link>
            <Link to="#" className="text-sm hover:text-[var(--color-primary)] transition-colors text-[var(--color-on-surface-variant)]">Privacy Policy</Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t ghost-border text-center text-sm text-[var(--color-on-surface-variant)]">
        &copy; {new Date().getFullYear()} Attenda. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

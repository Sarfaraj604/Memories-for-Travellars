import { useState } from 'react';
import { faqs } from '../data/siteContent';

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <div className="faq-list">
      {faqs.map((faq, index) => (
        <div className="faq-item" key={faq.question}>
          <button onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}>{faq.question}</button>
          {open === index && <p>{faq.answer}</p>}
        </div>
      ))}
    </div>
  );
}

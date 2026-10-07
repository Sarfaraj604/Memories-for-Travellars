import { useState } from 'react';

export default function FAQ({ faqs = [] }) {
  const [open, setOpen] = useState(0);

  if (!faqs.length) return null;

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
